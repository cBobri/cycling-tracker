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
      moving: Boolean,
      timestamp: { type: Date },
    },
  ],
  magnitudeData: { type: [Number], default: [] },
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
