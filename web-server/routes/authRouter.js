const express = require("express");
const router = express.Router();

const { requireUser, checkUser } = require("../controllers/usersController");
const {
    establishConnection,
    respondAndCloseConnection,
    checkForAuthRequest,
} = require("../controllers/authController");

router.get("/listen/:userId", establishConnection);
router.get("/check", checkUser, requireUser, checkForAuthRequest);
router.post("/finish", checkUser, requireUser, respondAndCloseConnection);

module.exports = router;
