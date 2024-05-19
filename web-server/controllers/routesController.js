const { Route } = require("../models/routeModel");
const { Entry } = require("../models/entryModel");
const { UserModel } = require("../models/userModel");

module.exports = {
    createRoute: async (req, res, next) => {
        try {
            const { entries, avg_speed, elevation, distance, travel_time, user } = req.body;

            const newRoute = new Route({
                entries,
                avg_speed,
                elevation,
                distance,
                travel_time,
                user,
            });

            await newRoute.save();
            return res.status(201).json({ message: "Route created successfully", route: newRoute });
        } catch (err) {
            const error = new Error("Failed to create route");
            error.status = 500;
            return next(error);
        }
    },

    getRoutes: async (req, res, next) => {
        try {
            const routes = await Route.find().sort({ created_at: -1 }).populate('entries').populate('user');
            return res.json(routes);
        } catch (err) {
            const error = new Error("Failed to fetch routes");
            error.status = 500;
            return next(error);
        }
    },

    getRouteById: async (req, res, next) => {
        try {
            const routeId = req.params.id;
            const route = await Route.findById(routeId).populate('entries').populate('user');
            if (!route) {
                const error = new Error("Route not found");
                error.status = 404;
                return next(error);
            }
            return res.json(route);
        } catch (err) {
            const error = new Error("Failed to fetch route");
            error.status = 500;
            return next(error);
        }
    },

    addEntryToRoute: async (req, res, next) => {
        try {
            const routeId = req.params.id;
            const { entryId } = req.body;

            const route = await Route.findById(routeId);
            if (!route) {
                const error = new Error("Route not found");
                error.status = 404;
                return next(error);
            }

            const entry = await Entry.findById(entryId);
            if (!entry) {
                const error = new Error("Entry not found");
                error.status = 404;
                return next(error);
            }

            route.entries.push(entryId);
            await route.save();
            return res.json({ message: "Entry added to route", route });
        } catch (err) {
            const error = new Error("Failed to add entry to route");
            error.status = 500;
            return next(error);
        }
    },
};