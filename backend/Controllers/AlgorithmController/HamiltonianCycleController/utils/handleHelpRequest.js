const { validTypes } = require("./info");

/**
 * @description Helper function to generate help information about the route /hamiltonian-cycle
 * @returns {Object} Help information about the route
 */
function handleHelpRequest() {
  return {
    title: "Hamiltonian Cycle Generator",
    description:
      "This route generates Hamiltonian cycles in a given graph using the backtracking algorithm.",
    query: {
      type: {
        description: "Type of response",
        options: validTypes,
        default: "path",
        details: {
          info: "Get information about the Hamiltonian paths",
          path: "Get the Hamiltonian paths or a specific path",
          help: "Get help about the route",
        },
      },
      path: {
        description: "Path number",
        options: ["all", "complete", "number"],
        default: "all",
        details: {
          all: "Get all Hamiltonian paths",
          complete: "Get the complete Hamiltonian path",
          number: "Get the Hamiltonian path at the given number",
        },
      },
    },
  };
}

module.exports = { handleHelpRequest };
