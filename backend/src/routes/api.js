const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Device = require('../models/Device');
const router = express.Router();

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
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
    validationRes.error.details.forEach((element) => {
      console.log(element.message);
    });
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
  const userID = res.locals.id;
  //TODO: get and current device status
  const ownedDevices = await Device.find({ user: userID });
  let sharedDevices = await Device.find({ subUser: userID });

  sharedDevices = sharedDevices.map((device) => {
    device.subUsers = [userID];
    return device;
  });

  return res.json({ msg: '', devices: [...ownedDevices, ...sharedDevices] });
});

router.post('/devices', async (req, res) => {
  const userID = res.locals.id;

  if (await Device.findOne({ deviceID: req.deviceID })) {
    return res.status(400).json({ msg: 'device already registered' });
  }

  //TODO: verify id validity i.e.: does that device even exist? meaning is in the device pool?
  //TODO: infere type of device by getting ID

  const newDevice = new Device({
    deviceName: req.body.deviceName,
    deviceID: userID,
    user: req.body.user,
    type: 'switch',
  });

  await newDevice.save();
  return res.status(200).json({ msg: 'Device succesfully added' });
});

async function deviceOwnedByUser(userID, deviceID) {
  //TODO: determine if deviceID is valid in pool of all devices active or not maybe this is unnecessary
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
  const userID = res.locals.id;
  const deviceID = req.params.id;

  const [owned, subOwned, device] = deviceOwnedByUser(userID, deviceID);

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
  const userID = res.locals.id;
  const deviceID = req.params.id;

  const [owned, subOwned, device] = deviceOwnedByUser(userID, deviceID);

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

  //TODO: Return device to pool of devices so that other users can register that new device
  return res.status(200).json({ msg: 'device removed', device });
});

router.put('/devices/:id', async (req, res) => {
  const userID = res.locals.id;
  const deviceID = req.params.id;

  const [owned, subOwned, device] = deviceOwnedByUser(userID, deviceID);

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
    if (!subUser || !subUser.verified) {
      return res.status(400).json({ msg: 'user not yet registered' });
    } else {
      device.subUsers.push(subUser.id);
    }
  }
  if (req.body.deviceName) {
    device.deviceName = req.body.deviceName;
  }

  await device.save();
  return res.status(200).json({ msg: 'device updated', device });
});

//TODO: sub user has to accept the subUser condition

module.exports = router;
