const express = require("express");
const AlgorithmRouter = express.Router();

const {
  HamiltonianCycleController,
} = require("../Controllers/AlgorithmController/HamiltonianCycleController/HamiltonianCycleController");

AlgorithmRouter.post("/hamiltonian-cycle", HamiltonianCycleController);

module.exports = AlgorithmRouter;
