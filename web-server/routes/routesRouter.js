const express = require("express");

const {
    createRoute,
    getRoutes,
    getRouteById,
    getUserRoutes,
    updateRouteById,
} = require("../controllers/routesController");
const { requireUser, checkUser } = require("../controllers/usersController");

const router = express.Router();

router.post("/", checkUser, requireUser, createRoute);
router.get("/", checkUser, getRoutes);
router.put("/", checkUser, requireUser, updateRouteById);
router.get("/user", checkUser, requireUser, getUserRoutes);
router.get("/:id", checkUser, getRouteById);

module.exports = router;
