const UserModel = require("../models/userModel");
const AuthRequestModel = require("../models/authRequestModel");
const signUserToken = require("../helpers/signUserToken");

const authClients = new Map();

const sendResponse = (userId, error, message) => {
    const authClient = authClients.get(userId.toString());

    if (!authClient) {
        return;
    }

    if (error) {
        const response = { message, status: false, user: null };

        authClient.res.write(`data: ${JSON.stringify(response)}\n\n`);
        return;
    }

    const { token, tokenData } = signUserToken(authClient.user);
    const response = { message, token, status: true, user: tokenData };

    authClient.res.write(`data: ${JSON.stringify(response)}\n\n`);
};

module.exports = {
    establishConnection: async (req, res, next) => {
        try {
            const user = await UserModel.findOne({ _id: req.params.userId });

            if (!user) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }

            const authRequest = await AuthRequestModel.findOne({
                user: user._id,
                finished_processing: false,
            });

            if (!authRequest) {
                const error = new Error("No auth request present");
                error.status = 404;
                return next(error);
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.setHeader("Access-Control-Allow-Origin", "*");

            res.write(":ok\n\n");

            const keepAliveInterval = setInterval(() => {
                res.write(":keep-alive\n\n");
            }, 15000);

            authClients.set(user._id.toString(), {
                res,
                user,
                keepAliveInterval,
            });

            req.on("close", () => {
                clearInterval(keepAliveInterval);
                authClients.delete(user._id);
            });
        } catch (err) {
            console.log(err);
            const error = new Error("Error when establishing connection");
            error.status = 500;
            return next(error);
        }
    },

    respondAndCloseConnection: async (req, res, next) => {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

            const authRequest = await AuthRequestModel.findOne({
                user: req.user._id,
                finished_processing: false,
                createdAt: { $gte: fiveMinutesAgo },
            });

            if (!authRequest) {
                const error = new Error("No auth request present");
                error.status = 404;
                return next(error);
            }

            await AuthRequestModel.findByIdAndDelete(authRequest._id);

            if (!authRequest.result) {
                const message = "Failed to authenticate";

                sendResponse(authRequest.user._id, true, message);

                const error = new Error(message);
                error.status = 400;
                return next(error);
            }

            sendResponse(
                authRequest.user._id,
                false,
                "Successfully authenticated"
            );

            return res.status(200).send("Authentication complete");
        } catch (err) {
            console.log(err);
            const error = new Error("Error when closing connection");
            error.status = 500;
            return next(error);
        }
    },

    checkForAuthRequest: async (req, res, next) => {
        try {
            const exists = await AuthRequestModel.exists({
                user: req.user._id,
                finished_processing: false,
            });

            return res.status(200).json({ requestExists: !!exists });
        } catch (err) {
            console.log(err);
            const error = new Error(
                "Error when checking for authentication request"
            );
            error.status = 500;
            return next(error);
        }
    },
};
