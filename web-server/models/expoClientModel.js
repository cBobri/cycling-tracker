const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expoClientSchema = new Schema({
    client_token: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("expo_client", expoClientSchema);
