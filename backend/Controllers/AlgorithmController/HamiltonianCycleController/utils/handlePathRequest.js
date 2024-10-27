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
const handlePathRequest = (type, path, cycles) => {
  if (path === "complete") {
    throw new CustomError(
      "This feature is under maintenance and will be available soon",
      503
    );
  }

  if (path === "all") {
    return { paths: cycles };
  }

  if (!isNaN(path) && path >= 0 && path < cycles.length) {
    return { path: cycles[path] };
  }

  throw new CustomError(
    `Invalid path number. There are total of ${
      cycles.length
    } paths in given graph. Valid path numbers are 0 to ${cycles.length - 1}`,
    422
  );
};

module.exports = { handlePathRequest };
