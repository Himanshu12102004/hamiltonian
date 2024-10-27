const {
  HamiltonianCycleGenerator,
  CustomError,
  catchAsync,
  validTypes,
  getCycleInfo,
  handlePathRequest,
  handleHelpRequest,
} = require("./utils/imports");

const HamiltonianCycleController = catchAsync(async (req, res) => {
  const { type = "path", path = "all" } = req.query;
  const { graph, startNode } = req.body;

  // Validate request type
  if (!validTypes.includes(type)) {
    const validString = validTypes.join(", ");
    throw new CustomError(
      `Invalid type: ${type}. Valid types are: ${validString}`,
      404
    );
  }

  const cycles = HamiltonianCycleGenerator(graph, startNode);

  if (type === "info") {
    const info = getCycleInfo(cycles);
    return res.status(200).json({ info });
  }

  if (type === "path") {
    const result = handlePathRequest(type, path, cycles);
    return res.status(200).json(result);
  }

  if (type === "help") {
    const help = handleHelpRequest();
    return res.status(200).json(help);
  }
});

module.exports = { HamiltonianCycleController };
