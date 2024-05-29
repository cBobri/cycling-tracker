const express = require("express");

const {
    createRoute,
    getRoutes,
    getRouteById,
} = require("../controllers/routesController");
const { requireUser, checkUser } = require("../controllers/usersController");

const router = express.Router();

router.post("/", checkUser, requireUser, createRoute);
router.get("/", checkUser, getRoutes);
router.get("/:id", checkUser, getRouteById);

module.exports = router;
