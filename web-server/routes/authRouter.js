const express = require("express");
const router = express.Router();

const { requireUser, checkUser } = require("../controllers/usersController");
const { sendNotification } = require("../controllers/authController");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.post("/send-notification", checkUser, requireUser, sendNotification);

module.exports = router;
