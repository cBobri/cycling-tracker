require("dotenv").config();
const jwt = require("jsonwebtoken");

const signUserToken = (user) => {
    const userData = {
        userId: user._id,
        email: user.email,
        username: user.username,
        weight: user.weight || null,
        bikeWeight: user.bikeWeight || null,
        enabled_2fa: user.enabled_2fa,
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    const { email, username, weight, bikeWeight, enabled_2fa } = userData;

    return {
        token,
        tokenData: {
            email,
            username,
            weight,
            bikeWeight,
            enabled_2fa,
        },
    };
};

module.exports = signUserToken;
