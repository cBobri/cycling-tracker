require("dotenv").config();
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    register: async (req, res, next) => {
        const { email, username, password, passwordRepeat } = req.body;

        //console.log("Register request received:", req.body);

        if (password !== passwordRepeat) {
            const error = new Error("Passwords don't match");
            error.status = 401;
            return next(error);
        }

        if (await UserModel.exists({ email })) {
            const error = new Error("Email is already taken");
            error.status = 402;
            return next(error);
        }

        if (await UserModel.exists({ username })) {
            const error = new Error("Username is already taken");
            error.status = 403;
            return next(error);
        }

        const user = new UserModel({
            email,
            username,
            password,
            weight: null,
            bikeWeight: null,
        });

        try {
            await user.save();
            //console.log("User created successfully:", user);
            return res.status(200).json(user);
        } catch (err) {
            const error = new Error("Failed to create user");
            error.status = 500;
            return next(error);
        }
    },

    login: async (req, res, next) => {
        const { email_username, password } = req.body;

        try {
            const user = await UserModel.findOne({
                $or: [{ email: email_username }, { username: email_username }],
            });

            if (!user) {
                const error = new Error("User not found");
                error.status = 401;
                return next(error);
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                const error = new Error("Incorrect password");
                error.status = 402;
                return next(error);
            }

            const userData = {
                userId: user._id,
                email: user.email,
                username: user.username,
                weight: user.weight || null,
                bikeWeight: user.bikeWeight || null,
                enabled_2fa
            };

            const token = jwt.sign(userData, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });

            const { email, username, weight, bikeWeight } = userData;

            return res.status(200).json({
                token,
                user: {
                    email,
                    username,
                    weight,
                    bikeWeight,
                },
            });
        } catch (err) {
            const error = new Error("Failed to login");
            error.status = 500;
            return next(error);
        }
    },
    requireUser: (req, res, next) => {
        if (!req.user) {
            const error = new Error("Unauthorized");
            error.status = 401;
            return next(error);
        }
        next();
    },
    checkUser: async (req, res, next) => {
        const token = req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            const error = new Error("Authentication token required");
            error.status = 401;
            return next(error);
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findOne({ _id: decoded.userId });

            if (!user) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }

            req.userTokenData = decoded;
            req.user = user;

            next();
        } catch (err) {
            const error = new Error("Invalid token");
            error.status = 401;
            return next(error);
        }
    },
    getUserDetails: (req, res, next) => {
        if (!req.user || !req.userTokenData) {
            const error = new Error("User not authenticated");
            error.status = 401;
            return next(error);
        }

        const { email, username, weight, bikeWeight } = req.userTokenData;

        return res.status(200).json({
            email,
            username,
            weight,
            bikeWeight,
        });
    },
};
