const RouteModel = require("../models/routeModel");
const processRoute = require("../helpers/processRoute");
module.exports = {
    getRoutes: async (req, res, next) => {
        try {
            const routes = await RouteModel.find({
                isProcessed: true,
                isPublic: true,
            })
                .sort({ createdAt: -1 })
                .populate("user")
                .populate("referencedRace");

            const simplifiedRoutes = routes.map(
                ({
                    _id,
                    createdAt,
                    title,
                    description,
                    isPublic,
                    isProcesssed,
                    stats,
                }) => {
                    _id,
                        createdAt,
                        title,
                        description,
                        isPublic,
                        isProcesssed,
                        stats;
                }
            );

            return res.status(200).json(simplifiedRoutes);
        } catch (err) {
            const error = new Error("Failed to fetch routes");
            error.status = 500;
            return next(error);
        }
    },

    getUserRoutes: async (req, res, next) => {
        try {
            const routes = await RouteModel.find({
                user: req.user._id,
            }).sort({ createdAt: -1 });
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
            }).populate("referencedRace");

            if (!route) {
                const error = new Error("Route not found");
                error.status = 404;
                return next(error);
            }

            if (
                !route.isPublic &&
                (!req.user || req.user._id.toString() != route.user.toString())
            ) {
                const error = new Error("Access denied");
                error.status = 403;
                return next(error);
            }

            const simplifiedData = route.data.map(({ gps, timestamp }) => {
                return {
                    gps,
                    timestamp,
                };
            });

            const simplifiedRoute = {
                ...route._doc,
                data: simplifiedData,
            };

            return res.status(200).json(simplifiedRoute);
        } catch (err) {
            const error = new Error("Failed to fetch route");
            error.status = 500;
            return next(error);
        }
    },

    createRoute: async (req, res, next) => {
        try {
            let {
                title,
                bikeWeight,
                cyclistWeight,
                data,
                recordingStart,
                recordingEnd,
            } = req.body;

            if (!title) title = "New Route";
            if (!bikeWeight) bikeWeight = 12;
            if (!cyclistWeight) cyclistWeight = 70;

            if (!data || !recordingStart || !recordingEnd) {
                const error = new Error("Necessary data missing");
                error.status = 400;
                return next(error);
            }

            const newRoute = new RouteModel({
                data,
                title,
                bikeWeight,
                cyclistWeight,
                recordingStart,
                recordingEnd,
                isProcessed: false,
                isPublic: false,
                description: "",
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
            await processRoute(newRoute._id); // To bi naj procesiralo novo pot

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
};
