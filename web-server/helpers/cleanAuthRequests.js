const AuthRequestModel = require("../models/authRequestModel");

const cleanAuthRequests = async () => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

        await AuthRequestModel.deleteMany({
            createdAt: { $lte: fiveMinutesAgo },
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = cleanAuthRequests;
