const mongoose = require('mongoose');

//device info schema
const DeviceSchema = mongoose.Schema({
  deviceName: {
    required: true,
    type: String,
  },
  deviceID: {
    required: true,
    type: String,
  },
  user: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  subUsers: {
    required: true,
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Device', DeviceSchema);
