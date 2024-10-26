const express = require("express");
const AlgorithmRouter = express.Router();

const {
  HamiltonianCycleController,
} = require("../Controllers/AlgorithmController/HamiltonianCycleController");

AlgorithmRouter.post("/hamiltonian-cycle", HamiltonianCycleController);

module.exports = AlgorithmRouter;
