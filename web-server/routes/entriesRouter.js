const express = require("express");
const { createEntry, getEntries, getEntryById } = require("../controllers/entriesController");
const router = express.Router();

router.post("/", createEntry);
router.get("/", getEntries);
router.get("/:id", getEntryById);

module.exports = router;