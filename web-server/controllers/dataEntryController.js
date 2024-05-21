const { Entry } = require("../models/entryModel");

module.exports = {
    createEntry: async (req, res, next) => {
        try {
            const { gps, accelerometer, gyroscope, timestamp } = req.body;

            const newEntry = new Entry({
                gps,
                accelerometer,
                gyroscope,
                timestamp,
            });

            await newEntry.save();
            return res.status(201).json({ message: "Entry created successfully", entry: newEntry });
        } catch (err) {
            const error = new Error("Failed to create entry");
            error.status = 500;
            return next(error);
        }
    },

    getEntries: async (req, res, next) => {
        try {
            const entries = await Entry.find().sort({ timestamp: -1 });
            return res.json(entries);
        } catch (err) {
            const error = new Error("Failed to fetch entries");
            error.status = 500;
            return next(error);
        }
    },

    getEntryById: async (req, res, next) => {
        try {
            const entryId = req.params.id;
            const entry = await Entry.findById(entryId);
            if (!entry) {
                const error = new Error("Entry not found");
                error.status = 404;
                return next(error);
            }
            return res.json(entry);
        } catch (err) {
            const error = new Error("Failed to fetch entry");
            error.status = 500;
            return next(error);
        }
    },
};