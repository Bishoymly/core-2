const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const Schema = require("./core/schema");
const { response } = require("express");
const designerRouter = require("./routes/designer");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/designer", designerRouter);
app.use(express.static(path.join(__dirname, "build")));

Schema.addRoutes(app);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(Schema.getSwaggerUIDocs())
);

//app.set('view engine', 'jade')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  // only providing error in development
  const response = {
    error: req.app.get("env") === "development" ? err.stack : err.message,
  };

  res.status(err.status || 500);
  res.json(response);
});

module.exports = app;
