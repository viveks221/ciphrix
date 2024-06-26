require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/db");
var authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
    cookie: {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      maxAge: 1 * 60 * 1000,
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", authRoutes);
app.use("/", userRoutes);

(async () => {
  try {
    await sequelize.sync();
    console.log("Models have been synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
})();
// error handler
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
