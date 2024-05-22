const express = require("express");

const {
    createRoute,
    getRoutes,
    getRouteById,
    addEntryToRoute,
    setRouteAsFinished,
} = require("../controllers/routesController");
const { requireUser, checkUser } = require("../controllers/usersController");

const router = express.Router();

router.post("/", checkUser, requireUser, createRoute);
router.get("/", checkUser, getRoutes);
router.get("/:id", checkUser, getRouteById);
router.post("/:id/entry", checkUser, requireUser, addEntryToRoute);
router.post("/:id/finish", checkUser, requireUser, setRouteAsFinished);

module.exports = router;
