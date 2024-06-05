const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authRequestSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    finished_processing: { type: Boolean, default: false },
    result: { type: Boolean, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("auth_request", authRequestSchema);
