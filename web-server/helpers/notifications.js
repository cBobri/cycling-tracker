const ExpoClientModel = require("../models/expoClientModel");
const { Expo } = require("expo-server-sdk");

const expo = new Expo();

const notifications = {
    sendNotifications: async (userId) => {
        const expoClients = await ExpoClientModel.find({
            user: userId,
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
                await ExpoClientModel.findByIdAndDelete(client._id);

                console.log("Failed", client);
                continue;
            }

            count++;
        }

        return count;
    },
};

module.exports = notifications;
