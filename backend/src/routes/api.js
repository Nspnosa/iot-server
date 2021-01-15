const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Device = require('../models/Device');
const router = express.Router();
const DeviceID = require('../models/DeviceID');
const nodemailer = require('nodemailer');
const { json } = require('express');

async function sendEmailVerification(userID, userEmail) {
  //generate token for email
  const emailToken = jwt.sign({ _id: userID }, process.env.JWT_SECRET);
  console.log(process.env.VERIFICATION_EMAIL);
  console.log(process.env.VERIFICATION_PASS);
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.VERIFICATION_EMAIL,
      pass: process.env.VERIFICATION_PASS,
    },
  });

  const url = `http://${process.env.HOST}:${process.env.PORT}/api/verifyemail/${emailToken}`;
  const message = `Please verify your email by visiting <a href="${url}">this link</a>`;
  const subject = `iot-server email confirmation`;

  let info = await transporter.sendMail({
    from: '"iot_server"', // sender address
    to: userEmail, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  });

  // console.log(info);
  // console.log('Message sent: %s', info.messageId);
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  name: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
});

router.post('/signup', async (req, res) => {
  const validationRes = signUpSchema.validate(req.body);

  if (validationRes.error) {
    validationRes.error.details.forEach((element) => {
      console.log(element.message);
    });
    return res
      .status(400)
      .json({ msg: `${validationRes.error.details[0].message}` });
  }

  const newUser = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  try {
    const emailExist = await User.findOne({ email: newUser.email });
    if (emailExist) {
      return res.status(400).json({ msg: `Email already exists${''}` });
    }
    await newUser.save();
    //send email to user
    sendEmailVerification(newUser._id, newUser.email);
    return res.json({ msg: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ msg: 'error trying to get email' });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

router.post('/login', async (req, res) => {
  const validationRes = loginSchema.validate(req.body);

  if (validationRes.error) {
    return res
      .status(400)
      .json({ msg: `${validationRes.error.details[0].message}` });
  }
  //determine if user exists
  const userToValidate = new User({
    email: req.body.email,
    password: req.body.password,
  });

  const userFromDB = await User.findOne({ email: userToValidate.email });
  if (userFromDB) {
    const hashComparisonResult = await bcrypt.compare(
      userToValidate.password,
      userFromDB.password
    );
    if (hashComparisonResult) {
      const token = jwt.sign({ _id: userFromDB._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      //TODO: uncomment this section once the user is verification is valid
      // if (userFromDB.verified) {
      // return res.json({ msg: `Welcome back ${userFromDB.name}`, token: token });
      // } else {
      //   return res.json({
      //     msg: `${userFromDB.name}, your account has yet to be verified, mind checking your email again?`,
      //   });
      // }
      return res.json({ msg: `Welcome back ${userFromDB.name}`, token: token });
    }
  }
  return res.status(400).json({ msg: 'invalid username or password' });
});

router.get('/devices', async (req, res) => {
  const userID = res.locals._id;
  //TODO: get and current device status

  const userFromDB = await User.findById(userID);
  let ownedDevices = await Device.find({ user: userID });

  let ownedDevicesModified = ownedDevices.map((device) => {
    return { ...device.toObject(), owned: true };
  });

  let sharedDevices = await Device.find({ subUsers: userFromDB.email });
  let sharedDevicesModified = sharedDevices.map((device) => {
    return { ...device.toObject(), owned: false };
  });

  sharedDevices = sharedDevices.map((device) => {
    device.subUsers = [userFromDB.email];
    return device;
  });
  console.log({ devices: [...ownedDevicesModified, ...sharedDevicesModified] });
  return res.json({
    msg: '',
    devices: [...ownedDevicesModified, ...sharedDevicesModified],
  });
  // return res.json({ msg: '', devices: [...ownedDevices, ...sharedDevices] });
});

const createDeviceSchema = Joi.object({
  deviceName: Joi.string().min(3).max(20).required(),
  deviceID: Joi.string().min(7).max(14).required(),
});

router.post('/devices', async (req, res) => {
  console.log(req.body);
  const validationRes = createDeviceSchema.validate(req.body);

  if (validationRes.error) {
    return res
      .status(400)
      .json({ msg: `${validationRes.error.details[0].message}` });
  }

  const userID = res.locals._id;
  const userInfo = await User.findById(userID);
  const deviceFromPool = await DeviceID.findOne({
    deviceID: req.body.deviceID,
  });

  if (!deviceFromPool) {
    return res.status(400).json({ msg: 'not valid deviceID' });
  } else if (deviceFromPool.used) {
    return res.status(400).json({ msg: 'device already registered' });
  }

  const newDevice = new Device({
    deviceName: req.body.deviceName,
    deviceID: req.body.deviceID,
    user: userID,
    type: deviceFromPool.deviceType,
    userEmail: userInfo.userEmail,
  });

  await newDevice.save();
  deviceFromPool.used = true;
  await deviceFromPool.save();
  return res.status(200).json({ msg: 'Device succesfully added' });
});

async function deviceOwnedByUser(userID, deviceID) {
  let device = await Device.findOne({ deviceID: deviceID });
  let owned = false;
  let subOwned = false;

  if (!device) {
    return [owned, subOwned, device];
  }

  if (device.user === userID) {
    owned = true;
  }

  if (device.subUsers.find((user, index) => user === userID)) {
    // device.subUsers = [user];
    subOwned = true;
  }

  return [owned, subOwned, device];
}

router.get('/devices/:id', async (req, res) => {
  const userID = res.locals._id;
  const deviceID = req.params.id;
  const [owned, subOwned, device] = await deviceOwnedByUser(userID, deviceID);

  if (!device || (!owned && !subOwned)) {
    return res.status(400).json({ msg: 'unknown device id' });
  }

  if (subOwned) {
    //only show the one subuser
    device.subUsers = [userID];
  }

  return res.status(200).json(device);
});

router.delete('/devices/:id', async (req, res) => {
  const userID = res.locals._id;
  const deviceID = req.params.id;

  const [owned, subOwned, device] = await deviceOwnedByUser(userID, deviceID);

  if (subOwned) {
    //if this is not the main user,  only the user is removed
    device.subUsers = device.subUsers.filter((user) => user !== userID);
    await device.save();
    device.subUsers = [];
    return res.status(200).json({ msg: 'device removed', device });
  }

  if (!device || !owned) {
    return res.status(400).json({ msg: 'unknown device id' });
  }

  await device.delete();

  const deviceFromPool = await DeviceID.findOne({ deviceID }); //return device to pool

  if (deviceFromPool) {
    deviceFromPool.used = false;
    await deviceFromPool.save();
  }

  return res.status(200).json({ msg: 'device removed', device });
});

const editDeviceSchema = Joi.object({
  deviceName: Joi.string().max(20).optional(),
  subUser: Joi.string().email().optional(),
});

router.put('/devices/:id', async (req, res) => {
  const validationRes = editDeviceSchema.validate(req.body);
  if (validationRes.error) {
    return res
      .status(400)
      .json({ msg: `${validationRes.error.details[0].message}` });
  }

  if (!req.body.deviceID && !req.body.subUser) {
    return res.status(400).json({ msg: 'no data to modify' });
  }

  const userID = res.locals._id;
  const deviceID = req.params.id;

  const [owned, subOwned, device] = await deviceOwnedByUser(userID, deviceID);

  if (subOwned) {
    return res.status(400).json({ msg: 'can only modify owned devices' });
  }

  if (!device || !owned) {
    return res.status(400).json({ msg: 'unknown device' });
  }

  if (req.body.subUser) {
    const owner = await User.findById(userID);

    if (req.body.subUser === owner.email) {
      return res
        .status(400)
        .json({ msg: 'Cannot share your own device with yourself' });
    }

    //verify if user exists
    const subUser = await User.findOne({ email: req.body.subUser });
    if (!subUser /*|| !subUser.verified*/) {
      return res.status(400).json({ msg: 'user not yet registered' });
    } else {
      //don't push user if already registered
      if (device.subUsers.includes(subUser._id)) {
        return res.status(400).json({ msg: 'Already shared with this user' });
      }
      device.subUsers.push(subUser.id);
    }
  }

  if (req.body.deviceName) {
    device.deviceName = req.body.deviceName;
  }

  await device.save();
  return res.status(200).json({ msg: 'device updated', device });
});

router.get('/verifyemail/:token', async (req, res) => {
  try {
    const url = `http://${process.env.HOST}:${process.env.PORT_FRONT_END}/login`;
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const dbUser = await User.findById(decodedToken._id);
    console.log(decodedToken);
    console.log(dbUser);
    if (dbUser.verified) {
      return res.redirect(url);
    }

    dbUser.verified = true;
    dbUser.save();
    return res.redirect(url);
  } catch {
    return res.status(400).json({ msg: 'invalid request to verify email' });
  }
});

async function sendLoginRecoveryEmail(userID, userEmail) {
  //generate token for email recovery
  const emailToken = jwt.sign({ _id: userID }, process.env.JWT_SECRET);
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.VERIFICATION_EMAIL,
      pass: process.env.VERIFICATION_PASS,
    },
  });

  const url = `http://${process.env.HOST}:${process.env.PORT_FRONT_END}/resetaccount/${emailToken}`;
  const message = `Please restore your login data by visiting <a href="${url}">this link</a>`;
  const subject = `iot-server email recovery`;

  let info = await transporter.sendMail({
    from: '"iot_server"', // sender address
    to: userEmail, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  });
}

const loginRecoverySchema = Joi.object({
  email: Joi.string().email().required(),
});

router.post('/loginrecovery', async (req, res) => {
  try {
    const validationRes = loginRecoverySchema.validate(req.body);
    if (validationRes.error) {
      return res
        .status(400)
        .json({ msg: `${validationRes.error.details[0].message}` });
    }

    const email = req.body.email;
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({ msg: 'invalid email address' });
    }

    if (!dbUser.verified) {
      return res.status(400).json({ msg: 'user has not been verified yet' });
    }

    // const token = jwt.sign(
    //   { _id: dbUser._id, expiresIn: 2 * 1000 * 60 },
    //   process.env.EMAIL_SECRET
    // );

    sendLoginRecoveryEmail(dbUser._id, dbUser.email);

    return res.json({ msg: `Recovery email sent to ${email}` });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: 'internal error generating recovery data' });
  }
});

const resetAccountSchema = Joi.object({
  password: Joi.string().min(8).max(16).required(),
});

router.post('/reset', async (req, res) => {
  try {
    const validationRes = resetAccountSchema.validate(req.body);
    if (validationRes.error) {
      return res
        .status(400)
        .json({ msg: `${validationRes.error.details[0].message}` });
    }

    const url = `http://${process.env.HOST}:${process.env.PORT_FRONT_END}/login`;
    const dbUser = await User.findById(res.locals._id, { password: 1 });
    console.log(dbUser);
    dbUser.password = bcrypt.hashSync(req.body.password, 10);
    await dbUser.save();
    return res.json({ msg: 'password reset' });
  } catch {
    return res.status(400).json({ msg: 'invalid request to reset password' });
  }
});

//TODO: connect to mqtt broker and check devices
//TODO: oauth to connect with google

//TODO: sub user has to accept the subUser condition
//TODO: if user doesn't confirm within a day, remove him from database

module.exports = router;
