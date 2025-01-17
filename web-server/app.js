require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const cron = require("node-cron");
const bodyParser = require("body-parser");

const usersRouter = require("./routes/usersRouter");
const routesRouter = require("./routes/routesRouter");
const authRouter = require("./routes/authRouter");
const testRouter = require("./routes/testRouter");

const app = express();

// Increase the limit to 50MB
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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
app.use("/api/users", usersRouter);
app.use("/api/routes", routesRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    extra: err.extra,
    error: req.app.get("env") === "development" ? err : {},
  });
});

if (process.env.NODE_ENV !== "test") {
  const scraper = require("./helpers/scraper");
  const cleanAuthRequests = require("./helpers/cleanAuthRequests");

  cron.schedule("*/15 * * * *", scraper.scrapeRecentRaces);
  cron.schedule("*/15 * * * *", cleanAuthRequests);
}

module.exports = app;
