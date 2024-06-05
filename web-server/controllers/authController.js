const ExpoClientModel = require("../models/expoClientModel");
const { Expo } = require("expo-server-sdk");

const expo = new Expo();

module.exports = {
    sendNotification: async (req, res, next) => {
        try {
            const expoClients = await ExpoClientModel.find({
                user: req.user._id,
            });

            let count = 0;

            for (const client of expoClients) {
                const message = {
                    to: client.client_token,
                    title: "Test notification",
                    body: "pls work dear god",
                    sound: "default",
                    priority: "high",
                    data: { url: "cycling-recorder://auth/2fa" },
                };

                const pushReceipt = await expo.sendPushNotificationsAsync([
                    message,
                ]);

                if (pushReceipt[0].status !== "ok") {
                    const res = await ExpoClientModel.findByIdAndDelete(
                        client._id
                    );

                    console.log("Failed", client);
                } else {
                    count++;
                }
            }

            return res
                .status(200)
                .json({ message: `Sent ${count} notifications` });
        } catch (err) {
            console.log(err);
            const error = new Error("Failed to send notification");
            error.status = 500;
            return next(error);
        }
    },
};
