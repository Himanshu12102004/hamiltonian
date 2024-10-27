const express = require("express");
const dotenv = require("dotenv");

const AlgorithmRouter = require("./Routes/AlgorithmRoutes");
const { CustomError } = require("./utils/CustomError");

dotenv.config({
  path: "./config.env",
});

const app = express();

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use("/api/v1", AlgorithmRouter);

app.all("*", (req, res, next) => {
  next(new CustomError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// ! Do not remove next parameter from the callback function as that cause the error handler to not work
// * Special to express, if there are 4 parameters in the callback function, express will treat it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    status: "error",
    message: err.message,
  });
});

module.exports = app;
