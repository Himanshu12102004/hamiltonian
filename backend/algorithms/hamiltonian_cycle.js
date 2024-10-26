const worker = require("node:worker_threads");

/**
 * Finds all Hamiltonian cycles in a given graph represented as an adjacency matrix.
 * A Hamiltonian cycle is a cycle that visits each vertex exactly once and returns to the starting vertex.
 *
 * @typedef {number[][]} GraphMatrix - Adjacency matrix representing the graph
 *
 * @typedef {Object} HamiltonianCycle
 * @property {number} from - Starting vertex of the step; -1 if the cycle is completed or dead end
 * @property {number} to - Ending vertex of the step; -1 if the cycle is completed or dead end
 * @property {number} TravelMode - forward = 0; backward = 1;pause = 2; pause either when on a dead end or when the cycle is completed
 * @property {Array<number>} nodes - empty when not a dead end otherwise contains the nodes that are visited
 * @property {boolean} completed - true if the hamiltonian cycle is found else false
 *
 * @param {GraphMatrix} graphMatrix - A 2D array where graphMatrix[i][j] represents the edge between vertices i and j.
 *                                   Use 1 for unweighted graphs or the actual weight for weighted graphs.
 *                                   Use 0 to indicate no edge exists.
 * @param {number} [startNode=0] - Starting vertex for the Hamiltonian cycle
 * @param {Object} [options] - Optional configuration parameters
 * @param {boolean} [options.weighted=false] - If true, treats the graph as weighted
 *
 * @throws {Error} If the input matrix is not square
 * @throws {Error} If the graph has less than 3 vertices
 *
 * @returns {Array<Array<HamiltonianCycle>>} Hamiltonian cycles found in the graph where each array represents a path which may or may not be a cycle
 * @example
 * // Unweighted graph
 * const graph = [
 *   [0, 1, 0, 1],
 *   [1, 0, 1, 0],
 *   [0, 1, 0, 1],
 *   [1, 0, 1, 0]
 * ];
 *
 * const cycles = await hamiltonianCycle(graph);
 * // Returns: [
 * //  [ { from: 0, to: 1, isForward: true },
 * //    { from: 1, to: 2, isForward: true },
 * //    { from: 2, to: 3, isForward: true },
 * //    { from: 3, to: 0, isForward: true } ],
 * //  [ { from: 0, to: 1, isForward: true },
 * //    { from: 1, to: 2, isForward: true },]
 * // ]
 */
function hamiltonianCycle(
  graphMatrix = [[]],
  startNode = 0,
  options = {
    weighted: false,
  }
) {
  // Input validation
  if (graphMatrix.length < 3) {
    throw new Error("The graph must have at least 3 vertices");
  }
  for (let i = 0; i < graphMatrix.length; i++) {
    if (graphMatrix.length !== graphMatrix[i].length) {
      throw new Error("The input matrix must be square");
    }
    for (let j = 0; j < graphMatrix[i].length; j++) {
      if (options.weighted) {
        if (graphMatrix[i][j] < 0 || typeof graphMatrix[i][j] !== "number") {
          throw new Error(
            "The input matrix must contain only non-negative values"
          );
        }
      } else {
        if (graphMatrix[i][j] !== 0 && graphMatrix[i][j] !== 1) {
          throw new Error(
            "An unweighted input matrix must contain only 0s and 1s"
          );
        }
      }
    }
  }

  // Initialize variables
  const n = graphMatrix.length;
  const visited = new Array(n).fill(0);
  const paths = [];
  let currentPath = [];
  let tempPath = [];

  visited[startNode] = 1;
  tempPath.push(startNode);
  function allVisited() {
    return visited.every((vertex) => vertex === 1);
  }
  function startNodeVistedOtherNotVisited() {
    return (
      visited[startNode] === 1 &&
      visited.filter((vertex) => vertex === 1).length === 1
    );
  }

  function findAllPaths(currentVertex) {
    for (let i = 0; i < n; i++) {
      if (graphMatrix[currentVertex][i] === 1 && visited[i] === 0) {
        visited[i] = 1;
        tempPath.push(i);
        currentPath.push({
          from: currentVertex,
          to: i,
          TravelMode: 0,
          nodes: [],
          completed: false,
        });
        if (allVisited()) {
          tempPath.push(startNode);
          currentPath.push({
            from: startNode,
            to: startNode,
            TravelMode: 2,
            nodes: [],
            completed: true,
          });
          paths.push([...currentPath]);
          tempPath.pop();
        } else {
          findAllPaths(i);
        }
        visited[i] = 0;
        tempPath.pop();
        currentPath.pop();
      }
    }
  }
  findAllPaths(startNode);
  return paths;
}
const graph = [
  [0, 1, 0, 1, 0],
  [1, 0, 1, 1, 1],
  [0, 1, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [0, 1, 1, 1, 0],
];

const paths = hamiltonianCycle(graph, 1);
console.log(paths);

module.exports = hamiltonianCycle;
