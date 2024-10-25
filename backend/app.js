const express = require("express");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env",
});

const app = express();

module.exports = app;
