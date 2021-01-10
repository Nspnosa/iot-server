const mongoose = require('mongoose');

//user info schema
const UserSchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
  },
  lastname: {
    require: true,
    type: String,
  },
  email: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  verified: {
    require: true,
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', UserSchema);
