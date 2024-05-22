const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    coordinates: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
    },
    magnitude: {
        value: Number,
        level: Number,
    },
    moving: Boolean,
    timestamp: { type: Date },
});

module.exports = mongoose.model("dataEntry", entrySchema);
