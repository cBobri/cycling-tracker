const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    avgSpeed: Number,
    elevation: Number,
    distance: Number,
    travelTime: Number,
    power: Number,
    powerRatio: Number,
    energy: Number,
});

const routeSchema = new mongoose.Schema({
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: "dataEntry" }],
    isProcessed: Boolean,
    bikeWeight: Number,
    cyclistWeight: Number,
    q1: statsSchema,
    q2: statsSchema,
    q3: statsSchema,
    q4: statsSchema,
    stats: statsSchema,
    proIndex: Number,
    referencedRace: { type: mongoose.Schema.Types.ObjectId, ref: "race" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("route", routeSchema);
