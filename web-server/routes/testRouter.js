const express = require("express");
const router = express.Router();
const RouteModel = require("../models/routeModel");

const { requireUser, checkUser } = require("../controllers/usersController");

router.get("/", (req, res) => {
  return res.status(200).send("Hello! It works.");
});

router.get("/auth", checkUser, requireUser, (req, res) => {
  return res.status(200).send(`Hello, ${req.user.username}!`);
});

router.get("/auth/route", checkUser, requireUser, async (req, res) => {
  try {
    const route = await RouteModel.findOne({
      user: req.user._id,
      isProcessed: true,
    });

    if (!route) {
      const error = new Error("Route not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).send(`Found route titled ${route.title}!`);
  } catch (err) {
    const error = new Error("Failed to set magnitude data to route");
    error.status = 500;
    return next(error);
  }
});

module.exports = router;
