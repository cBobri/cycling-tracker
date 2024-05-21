const express = require("express");
const { createRoute, getRoutes, getRouteById, addEntryToRoute } = require("../controllers/routesController");
const router = express.Router();

router.post("/", createRoute);
router.get("/", getRoutes);
router.get("/:id", getRouteById);
router.post("/:id/entries", addEntryToRoute);

module.exports = router;
