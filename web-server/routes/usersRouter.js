const express = require("express");
const {
    register,
    login,
    requireUser,
    checkUser,
    getUserDetails,
} = require("../controllers/usersController");
const router = express.Router();

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);

router.get("/details", checkUser, getUserDetails);

// Zaščitena pot
router.get("/protected", checkUser, requireUser, (req, res) => {
    res.status(200).json({
        message: "This is a protected route",
        user: req.user,
    });
});

module.exports = router;
