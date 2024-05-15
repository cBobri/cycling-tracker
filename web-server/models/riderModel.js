const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const riderSchema = new Schema({
    name: String,
    birthday: Date,
    nationality: String,
    weight: Number,
    height: Number,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

const RiderModel = mongoose.model("rider", riderSchema);
module.exports = RiderModel;
