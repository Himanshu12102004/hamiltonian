const {
  HamiltonianCycleGenerator,
  CustomError,
  catchAsync,
  validTypes,
  getCycleInfo,
  handlePathRequest,
  handleHelpRequest,
  getSocketInstance,
} = require("./utils/imports");

const HamiltonianCycleController = catchAsync(async (req, res) => {
  const {
    type = "path",
    path = "all",
    graph_type = "matrix_graph",
  } = req.query;
  const { graph, startNode } = req.body;

  // Validate request type
  if (!validTypes.includes(type)) {
    const validString = validTypes.join(", ");
    throw new CustomError(
      `Invalid Parameter`,
      404,
      `Invalid type: ${type}. Valid types are: ${validString}`
    );
  }

  const socket = getSocketInstance();

  const cycles = HamiltonianCycleGenerator(
    graph,
    startNode,
    {
      graph_type: graph_type,
      weighted: false,
    },
    socket
  );

  if (type === "info") {
    socket.sendMessage(
      "HamiltonianCycle",
      "Generating Info of Hamiltonian Cycle of the Graph"
    );
    const info = getCycleInfo(cycles, socket);
    socket.sendMessage(
      "HamiltonianCycle",
      "Info of Hamiltonian Cycle of the Graph Generated"
    );
    return res.status(200).json(info);
  }

  if (type === "path") {
    socket.sendMessage(
      "HamiltonianCycle",
      "Generating Hamiltonian Cycle of the Graph"
    );
    const result = handlePathRequest(type, path, cycles, socket);
    socket.sendMessage(
      "HamiltonianCycle",
      "Hamiltonian Cycle of the Graph Generated"
    );
    return res.status(200).json(result);
  }

  if (type === "help") {
    const help = handleHelpRequest();
    return res.status(200).json(help);
  }
});

module.exports = { HamiltonianCycleController };
