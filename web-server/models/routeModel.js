const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    avgSpeed: Number,
    maxSpeed: Number,
    elevation: Number,
    distance: Number,
    travelTime: Number,
    power: Number,
    powerRatio: Number,
    energy: Number,
});

const routeSchema = new mongoose.Schema({
    data: [
        {
            gps: {
                latitude: Number,
                longitude: Number,
                altitude: Number,
            },
            magnitude: {
                value: Number,
                level: Number,
                data: [
                    {
                        ax: Number,
                        ay: Number,
                        az: Number,
                        gx: Number,
                        gy: Number,
                        gz: Number,
                    },
                ],
            },
            moving: Boolean,
            timestamp: { type: Date },
        },
    ],
    isProcessed: Boolean,
    isPublic: Boolean,
    title: String,
    description: String,
    bikeWeight: Number,
    cyclistWeight: Number,
    stats: statsSchema,
    segments: [statsSchema],
    percentageStats: [statsSchema],
    centerCoordinates: {
        latitude: Number,
        longitude: Number,
    },
    proIndex: Number,
    winnerIndex: Number,
    referencedRaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "race" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    recordingStart: Date,
    recordingEnd: Date,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("route", routeSchema);
