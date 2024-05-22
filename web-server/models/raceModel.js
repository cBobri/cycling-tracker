const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wattageSchema = new Schema({
    power: Number,
    powerRatio: Number,
    energy: Number,
});

const raceSchema = new Schema({
    name: String,
    date: String,
    category: String,
    distance: Number,
    verticalMeters: Number,
    winner: String,
    winnerWattage: wattageSchema,
    averageWattage: wattageSchema,
    postedAt: Date,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

module.exports = mongoose.model("race", raceSchema);
