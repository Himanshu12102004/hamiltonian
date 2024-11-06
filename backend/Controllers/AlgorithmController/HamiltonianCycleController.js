const {
  HamiltonianCycleGenerator,
} = require('../../Algorithms/HamiltonianCycleGenerator');
const catchAsync = require('../Middlewares/errorHandler');

const HamiltonianCycleController = catchAsync(async (req, res) => {
  const graph = req.body.graph;
  const startNode = req.body.startNode;
  const cycles = HamiltonianCycleGenerator(graph, startNode);
  res.status(200).json({ cycles });
});

module.exports = { HamiltonianCycleController };
