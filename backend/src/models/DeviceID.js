const mongoose = require('mongoose');

//user info schema
const DeviceIDSchema = mongoose.Schema({
  deviceID: {
    required: true,
    type: String,
  },
  deviceType: {
    required: true,
    type: String,
  },
  used: {
    required: true,
    default: false,
    type: Boolean,
  },
});

module.exports = mongoose.model('DeviceID', DeviceIDSchema);
