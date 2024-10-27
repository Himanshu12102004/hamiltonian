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
    total_paths: cycles.length,
    hamiltonian_paths: 0,
    non_hamiltonian_paths: 0,
  };
  cycles.forEach((cycle) => {
    if (cycle[cycle.length - 1].completed) {
      info.hamiltonian_paths++;
    } else {
      info.non_hamiltonian_paths++;
    }
  });
  return info;
};

module.exports = { getCycleInfo };
