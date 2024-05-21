const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    gps: {
      latitude: Number,
      longitude: Number,
    },
    accelerometer: {
      x: Number,
      y: Number,
      z: Number,
    },
    gyroscope: {
      alpha: Number,
      beta: Number,
      gamma: Number,
    },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Entry', entrySchema);