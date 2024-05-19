const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }],
    avg_speed: Number,
    elevation: Number,
    distance: Number,
    travel_time: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Route', routeSchema);