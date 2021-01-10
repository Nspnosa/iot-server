const { boolean } = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const arrayOfAllowedPaths = ['/signup', '/login', '/loginrecovery'];
module.exports = async (req, res, next) => {
  if (arrayOfAllowedPaths.includes(req.path.toString())) {
    return next();
  }

  if (req.path.toString().startsWith('/verifyemail')) {
    return next();
  }

  if (!req.headers.authorization) {
    return res.status(400).json({ msg: 'no authorization header' });
  }

  try {
    const token = req.headers.authorization.split(' ');
    const decodedToken = jwt.verify(token[1], process.env.JWT_SECRET);
    const dbUser = await User.findById(decodedToken._id);
    if (!dbUser) {
      return res.status(400).json({ msg: 'Invalid token' });
    }
    if (!dbUser.verified) {
      return res
        .status(400)
        .json({ msg: 'Email regitered, please verfiy your account first' });
    }

    if (path === '/verify') {
      return res.json({ msg: 'valid user' });
    }

    res.locals._id = decodedToken._id;
    return next();
  } catch {
    return res.status(401).json({ msg: 'invalid request' });
  }
};
