const { sendNotifications } = require("../helpers/notifications");

module.exports = {
    sendNotification: async (req, res, next) => {
        try {
            const count = await sendNotifications(req.user._id);

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
