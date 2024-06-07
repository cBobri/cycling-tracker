const express = require("express");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    createRoute,
    getRoutes,
    getRouteById,
    getUserRoutes,
    updateRouteById,
    importRoute,
} = require("../controllers/routesController");
const { requireUser, checkUser } = require("../controllers/usersController");

const router = express.Router();

router.post("/", checkUser, requireUser, createRoute);
router.post(
    "/import",
    checkUser,
    requireUser,
    upload.single("gpxFile"),
    importRoute
);
router.get("/", checkUser, getRoutes);
router.put("/", checkUser, requireUser, updateRouteById);
router.get("/user", checkUser, requireUser, getUserRoutes);
router.get("/:id", checkUser, getRouteById);

module.exports = router;
