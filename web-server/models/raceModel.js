const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceSchema = new Schema({
    name: String,
    category: String,
    distance: Number,
    verticalMeters: Number,
    winner: {
        type: Schema.Types.ObjectId,
        ref: "rider",
    },
    winnerWattage: Number,
    averageWattage: Number,
    startedAt: Date,
    postedAt: Date,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

const RaceModel = mongoose.model("race", raceSchema);
module.exports = RaceModel;
