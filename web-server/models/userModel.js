require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    weight: Number,
    bikeWeight: Number,
    enabled_2fa: {
        type: Boolean,
        default: false
    }
});

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) {
        return next();
    }

    bcrypt.hash(
        user.password,
        parseInt(process.env.PASSWORD_SALT),
        (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        }
    );
});

module.exports = mongoose.model("user", userSchema);
