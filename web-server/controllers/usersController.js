require("dotenv").config();
const UserModel = require("../models/userModel");
const ExpoClientModel = require("../models/expoClientModel");
const AuthRequestModel = require("../models/authRequestModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const processProfile = require("../helpers/processProfile");
const { sendAuthenticationNotification } = require("../helpers/notifications");

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
        const { email_username, password, client_token, source } = req.body;

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

            // Handle login for mobile app - save their notification token if not yet saved
            console.log("source", source)
            console.log("client_token", client_token)
            if (
                source === "mobile-app" &&
                client_token &&
                !(await ExpoClientModel.exists({ client_token: client_token }))
            ) {
                const newExpoClient = new ExpoClientModel({
                    client_token,
                    user: user._id,
                });

                await newExpoClient.save();
            }

            // Handle login for website - send notification to phone, create auth_request if it doesns't exist, send response that authentication must happen
            if (
                source === "website" &&
                user.enabled_2fa &&
                (await ExpoClientModel.exists({ user: user._id }))
            ) {
                if (
                    !(await AuthRequestModel.exists({
                        user: user._id,
                        finished_processing: false,
                    }))
                ) {
                    const newAuthRequestModel = new AuthRequestModel({
                        user: user._id,
                    });
                    await newAuthRequestModel.save();
                }

                sendAuthenticationNotification(user._id);

                const error = new Error("Two-Factor Authentication Required");
                error.status = 403;
                return next(error);
            }

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

            const { email, username, weight, bikeWeight, enabled_2fa } =
                userData;

            return res.status(200).json({
                token,
                user: {
                    email,
                    username,
                    weight,
                    bikeWeight,
                    enabled_2fa,
                },
            });
        } catch (err) {
            console.log(err);
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
        const token = req.header("Authorization")?.replace("Bearer ", "");

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

        const { email, username, weight, bikeWeight, enabled_2fa } =
            req.userTokenData;

        return res.status(200).json({
            email,
            username,
            weight,
            bikeWeight,
            enabled_2fa,
        });
    },
    getUserProfile: async (req, res, next) => {
        try {
            const profileDetails = await processProfile(req.user);

            return res.status(200).json(profileDetails);
        } catch (err) {
            console.log(err);
            const error = new Error("Failed to fetch user profile");
            error.status = 500;
            return next(error);
        }
    },
    updateUserProfile: async (req, res, next) => {
        try {
            const { username, weight, bikeWeight } = req.body;
            const trimmedUsername = username.trim();

            const usernameTaken = await UserModel.exists({
                username: trimmedUsername,
                _id: { $ne: req.user._id },
            });

            if (!trimmedUsername || usernameTaken) {
                const error = new Error("Username is invalid or taken");
                error.status = 400;
                return next(error);
            }

            req.user.username = trimmedUsername;
            req.user.weight = +weight || null;
            req.user.bikeWeight = +bikeWeight || null;

            await req.user.save();

            const profileDetails = await processProfile(req.user);

            return res.status(200).json(profileDetails);
        } catch (err) {
            console.log(err);
            const error = new Error("Failed to update user profile");
            error.status = 500;
            return next(error);
        }
    },
};
