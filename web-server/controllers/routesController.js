const RouteModel = require("../models/routeModel");
const EntryModel = require("../models/entryModel");
const UserModel = require("../models/userModel");

module.exports = {
    getRoutes: async (req, res, next) => {
        try {
            const routes = await RouteModel.find({
                isProcessed: true,
                isPublic: true,
            })
                .sort({ createdAt: -1 })
                .populate("entries")
                .populate("user")
                .populate("referencedRace");
            return res.status(200).json(routes);
        } catch (err) {
            const error = new Error("Failed to fetch routes");
            error.status = 500;
            return next(error);
        }
    },

    getUsersRoutes: async (req, res, next) => {
        try {
            const routes = await RouteModel.find({
                user: req.user._id,
            })
                .sort({ createdAt: -1 })
                .populate("entries")
                .populate("user")
                .populate("referencedRace");
            return res.status(200).json(routes);
        } catch (err) {
            const error = new Error("Failed to fetch routes");
            error.status = 500;
            return next(error);
        }
    },

    getRouteById: async (req, res, next) => {
        try {
            const routeId = req.params.id;
            const route = await RouteModel.findOne({
                _id: routeId,
                isProcessed: true,
            })
                .populate("entries")
                .populate("user")
                .populate("referencedRace");

            if (!route) {
                const error = new Error("Route not found");
                error.status = 404;
                return next(error);
            }

            if (
                !route.isPublic &&
                (!req.user || req.user._id != route.user._id)
            ) {
                const error = new Error("Access denied");
                error.status = 403;
                return next(error);
            }

            return res.status(200).json(route);
        } catch (err) {
            const error = new Error("Failed to fetch route");
            error.status = 500;
            return next(error);
        }
    },

    createRoute: async (req, res, next) => {
        try {
            const bikeWeight = req.body.bikeWeight || 12;
            const cyclistWeight = req.body.cyclistWeight || 70;
            const entry = req.body.entry;

            const newEntry = new EntryModel({
                coordinates: entry.coordinates,
                magnitude: entry.magnitude,
                moving: false,
                timestamp: entry.timestamp,
            });

            await newEntry.save();

            const newRoute = new RouteModel({
                entries: [newEntry._id],
                isProcessed: false,
                isPublic: false,
                isDoneRecording: false,
                bikeWeight,
                cyclistWeight,
                q1: null,
                q2: null,
                q3: null,
                q4: null,
                stats: null,
                proIndex: null,
                referencedRace: null,
                user: req.user._id,
            });

            await newRoute.save();

            return res.status(201).json({
                message: "Route created successfully",
                data: newRoute,
            });
        } catch (err) {
            const error = new Error("Failed to create route");
            error.status = 500;
            return next(error);
        }
    },

    addEntryToRoute: async (req, res, next) => {
        try {
            const routeId = req.params.id;

            const entry = req.body.entry;

            if (!routeId || !entry) {
                const error = new Error("Route id or entry not given");
                error.status = 400;
                return next(error);
            }

            const route = await RouteModel.findOne({
                _id: routeId,
                user: req.user._id,
                isDoneRecording: false,
            });

            if (!route) {
                const error = new Error("Route not found");
                error.status = 404;
                return next(error);
            }

            const newEntry = new EntryModel({
                coordinates: entry.coordinates,
                magnitude: entry.magnitude,
                moving: entry.moving,
                timestamp: entry.timestamp,
            });

            await newEntry.save();

            route.entries.push(newEntry._id);
            await route.save();

            return res
                .status(201)
                .json({ message: "Entry added to route", newEntry });
        } catch (err) {
            const error = new Error("Failed to add entry to route");
            error.status = 500;
            return next(error);
        }
    },

    setRouteAsFinished: async (req, res, next) => {
        try {
            const routeId = req.params.id;

            const route = await RouteModel.findOne({
                _id: routeId,
                user: req.user._id,
                isDoneRecording: false,
            });

            if (!route) {
                const error = new Error("Route not found");
                error.status = 404;
                return next(error);
            }

            route.isDoneRecording = true;

            // TODO - process route here, or set cron task which will process all finished unprocessed routes periodically

            await route.save();

            return res.status(200).json({ message: "Route finished" });
        } catch (err) {
            const error = new Error("Failed to set route as finished");
            error.status = 500;
            return next(error);
        }
    },
};
