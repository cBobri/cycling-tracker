const express = require("express");
const {
    register,
    login,
    requireUser,
    checkUser,
    getUserDetails,
    getUserProfile,
    updateUserProfile,
} = require("../controllers/usersController");
const router = express.Router();

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);

router.get("/details", checkUser, getUserDetails);

router.get("/profile", checkUser, requireUser, getUserProfile);
router.put("/profile", checkUser, requireUser, updateUserProfile);

// Zaščitena pot
router.get("/protected", checkUser, requireUser, (req, res) => {
    res.status(200).json({
        message: "This is a protected route",
        user: req.user,
    });
});

module.exports = router;
