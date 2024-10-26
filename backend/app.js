const express = require("express");
const dotenv = require("dotenv");

const router = require("./routes/Hamiltonian");

dotenv.config({
  path: "./config/config.env",
});

const app = express();

app.use(express.json());
app.use("/api/v1", router);

module.exports = app;
