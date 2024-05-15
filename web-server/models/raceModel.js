const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wattageSchema = new Schema({
    power: Number,
    powerRatio: Number,
    energy: Number,
});

const raceSchema = new Schema({
    name: String,
    category: String,
    distance: Number,
    verticalMeters: Number,
    winner: {
        type: Schema.Types.ObjectId,
        ref: "rider",
    },
    winnerWattage: wattageSchema,
    averageWattage: wattageSchema,
    startedAt: Date,
    postedAt: Date,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

const RaceModel = mongoose.model("race", raceSchema);
module.exports = RaceModel;
