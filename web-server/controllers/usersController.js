require("dotenv").config();
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    register: async (req, res, next) => {
        const { email, username, password, passwordRepeat, weight, bikeWeight } = req.body;

        //console.log("Register request received:", req.body);

        if (password !== passwordRepeat) {
            const error = new Error("Passwords don't match");
            error.status = 400;
            return next(error);
        }

        if (await UserModel.exists({ email })) {
            const error = new Error("Email is already taken");
            error.status = 400;
            return next(error);
        }

        if (await UserModel.exists({ username })) {
            const error = new Error("Username is already taken");
            error.status = 400;
            return next(error);
        }

        const user = new UserModel({
            email,
            username,
            password,
            weight,
            bikeWeight
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
        const { username, password } = req.body;

        try {
            const user = await UserModel.findOne({ username });

            if (!user) {
                const error = new Error("User not found");
                error.status = 401;
                return next(error);
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                const error = new Error("Incorrect password");
                error.status = 401;
                return next(error);
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                    username: user.username,
                },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            return res.status(200).json({
                token
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
        const token = req.header('Authorization');

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

            req.user = user;
            next();
        } catch (err) {
            const error = new Error("Invalid token");
            error.status = 401;
            return next(error);
        }
    },
    getUserDetails: (req, res, next) => {
        if (!req.user) {
            const error = new Error("User not authenticated");
            error.status = 401;
            return next(error);
        }
        return res.status(200).json(req.user);
    }

};