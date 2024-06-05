require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const cron = require("node-cron");

const usersRouter = require("./routes/usersRouter");
const routesRouter = require("./routes/routesRouter");
const processRoute = require("./helpers/processRoute"); // Uvozimo funkcijo

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
app.use("/routes", routesRouter);

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
cron.schedule("*/15 * * * *", scraper.scrapeRecentRaces);


//to je samo temporary
const routeId = "665f07266eb56d440dc02bcc"; 
processRoute(routeId)
    .then(() => console.log('Route processed successfully on server start'))
    .catch(err => console.error('Failed to process route on server start', err));

module.exports = app;
