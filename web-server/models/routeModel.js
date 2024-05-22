const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    avgSpeed: Number,
    elevation: Number,
    power: Number,
    powerRatio: Number,
    energy: Number,
});

const routeSchema = new mongoose.Schema({
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: "entry" }],
    isProcessed: Boolean,
    bikeWeight: Number,
    cyclistWeight: Number,
    distance: Number,
    travelTime: Number,
    q1: statsSchema,
    q2: statsSchema,
    q3: statsSchema,
    q4: statsSchema,
    stats: statsSchema,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("route", routeSchema);
