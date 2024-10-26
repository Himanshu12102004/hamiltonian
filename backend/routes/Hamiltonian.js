const { hamiltonianCycle } = require("../algorithms/hamiltonian_cycle");
const express = require("express");
const router = express.Router();

function Hamiltonian(req, res) {
  const graph = req.body.graph;
  const startNode = req.body.startNode;
  const cycles = hamiltonianCycle(graph, startNode);
  res.json({ cycles });
}
router.post("/hamiltonian", Hamiltonian);

module.exports = router;
