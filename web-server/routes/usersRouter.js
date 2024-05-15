const express = require("express");
const { register, login, requireUser, checkUser} = require("../controllers/usersController");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.post('/register', register);
router.post('/login', login);

// Zaščitena pot
router.get('/protected', checkUser, requireUser, (req, res) => {
    res.status(200).json({ message: "This is a protected route", user: req.user });
});

module.exports = router;