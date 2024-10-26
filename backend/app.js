const express = require("express");
const dotenv = require("dotenv");
// const path = require("path");
// const fs = require("fs");

// const log = fs.createWriteStream(path.join(__dirname, "system.log"), {
//   flags: "a",
// });

const AlgorithmRouter = require("./Routes/AlgorithmRoutes");
const { CustomError } = require("./utils/CustomError");

dotenv.config({
  path: "./config.env",
});

const app = express();

app.use(express.json());

// app.use((req, res, next) => {
//   console.log(req.body);
//   log.write(
//     `[${new Date().toISOString()}] ${req.method} ${
//       req.originalUrl
//     }\n ${JSON.stringify(req.body)} ${req.headers["user-agent"]}\n`
//   );
//   next();
// });
app.use("/api/v1", AlgorithmRouter);

app.all("*", (req, res, next) => {
  next(new CustomError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res) => {
  res.status(err.statusCode).json({
    status: "error",
    message: err.message,
  });
});

module.exports = app;
