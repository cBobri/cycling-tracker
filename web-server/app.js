require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const cron = require("node-cron");

const usersRouter = require("./routes/usersRouter");

const app = express();

app.use(cors());

// Connect to DB
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.on("error", () => {
    console.error.bind(console, "Failed to connect to DB");
});
db.on("open", () => {
    console.log("Connected to DB");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Add routers
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        //namesto res.render("error");
        message: err.message,
        error: req.app.get("env") === "development" ? err : {},
    });
});

const scraper = require("./helpers/scraper");
const calculateWattage = require("./helpers/calculateWattage");
cron.schedule("*/15 * * * *", scraper.scrapeRecentRaces);

calculateWattage(193 * 1000, 2162, 4 * 3600 + 7 * 60 + 44, 62, true);
calculateWattage(169.78 * 1000, 1680, 3 * 3600 + 53 * 60 + 42, 80, true);
calculateWattage(114.9 * 1000, 1788, 3 * 3600 + 3 * 60 + 34, 55, true);

module.exports = app;
