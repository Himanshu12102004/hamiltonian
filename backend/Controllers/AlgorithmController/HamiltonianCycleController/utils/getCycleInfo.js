/**
 * @description Get the information about the Hamiltonian paths found in the given graph
 * @param {Array<Array<HamiltonianCycle>>} cycles
 * @returns {Object} Information about the cycles
 * @property {number} total_paths - Total number of paths
 * @property {number} hamiltonian_paths - Number of Hamiltonian paths
 * @property {number} non_hamiltonian_paths - Number of non-Hamiltonian paths
 */
const getCycleInfo = (cycles) => {
  const info = {
    animation: 1,
    total_paths: cycles.paths.length + 1,
    hamiltonian_paths: 0,
    non_hamiltonian_paths: 0,
  };
  cycles.paths.forEach((cycle) => {
    if (cycle[cycle.length - 1].completed) {
      info.hamiltonian_paths++;
    } else {
      info.non_hamiltonian_paths++;
    }
  });
  return info;
};

module.exports = { getCycleInfo };
