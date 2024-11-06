const { CustomError } = require("../../../../utils/CustomError");

/**
 * @description Handle the path request based on the type and path number
 *
 * @param {string} type - Request type
 * @param {string|number} path - Requested path number
 * @param {Array<Array<HamiltonianCycle>>} cycles - Hamiltonian cycles found in the graph
 *
 * @returns {Object} Response object
 * @property {Array<Array<HamiltonianCycle>>} paths - All Hamiltonian paths
 * @property {Array<HamiltonianCycle>} path - Requested Hamiltonian path
 *
 * @throws {CustomError} If the path number is invalid
 * @throws {CustomError} If the requested feature is under maintenance
 *
 */
const handlePathRequest = (type, path, cycles, Socket) => {
  if (path === "complete") {
    Socket.sendMessage(
      "HamiltonianCycle",
      "Sending Complete Hamiltonian Cycle of the Graph"
    );
    return {
      hamiltonian_cycles: {
        complete: cycles.complete,
        paths: [],
        nth_path: [],
      },
    };
  }

  if (path === "all") {
    Socket.sendMessage(
      "HamiltonianCycle",
      "Sending All Hamiltonian Cycle of the Graph"
    );
    return {
      hamiltonian_cycles: {
        complete: cycles.complete,
        paths: cycles.paths,
        nth_path: [],
      },
    };
  }

  if (!isNaN(path) && path >= 0 && path < cycles.paths.length) {
    Socket.sendMessage(
      "HamiltonianCycle",
      `Sending ${path}th Hamiltonian Cycle of the Graph`
    );
    return {
      hamiltonian_cycles: {
        complete: [],
        paths: [],
        nth_path: cycles.paths[path],
      },
    };
  } else {
    Socket.sendMessage(
      "HamiltonianCycle",
      "Invalid Path Number. Error in Generating Hamiltonian Cycle of the Graph"
    );
    throw new CustomError(
      `Invalid path number. There are total of ${
        cycles.length
      } paths in given graph. Valid path numbers are 0 to ${
        cycles.paths.length - 1
      }`,
      422
    );
  }
};

module.exports = { handlePathRequest };
