const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
  deviceName: {
    require: true,
    type: String,
  },
  deviceID: {
    require: true,
    type: String,
  },
  user: {
    require: true,
    type: String,
  },
  type: {
    require: true,
    type: String,
  },
  subUsers: {
    required: true,
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Device', DeviceSchema);
