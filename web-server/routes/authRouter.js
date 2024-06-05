const express = require("express");
const router = express.Router();

const { requireUser, checkUser } = require("../controllers/usersController");
const { sendTestNotification } = require("../controllers/authController");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

module.exports = router;
