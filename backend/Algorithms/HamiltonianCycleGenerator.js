const { CustomError } = require("../utils/CustomError");

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
function HamiltonianCycleGenerator(
  graphMatrix = [[]],
  startNode = 0,
  options = {
    weighted: false,
    graph_type: "matrix_graph",
  }
) {
  if (graphMatrix.length < 3) {
    throw new CustomError("The graph must have at least 3 vertices", 422);
  }
  if (options.graph_type === "graph_type") {
    for (let i = 0; i < graphMatrix.length; i++) {
      if (graphMatrix.length !== graphMatrix[i].length) {
        throw new CustomError("The input matrix must be square", 422);
      }
      for (let j = 0; j < graphMatrix[i].length; j++) {
        if (options.weighted) {
          if (graphMatrix[i][j] < 0 || typeof graphMatrix[i][j] !== "number") {
            throw new CustomError(
              "The input matrix must contain only non-negative values",
              422
            );
          }
        } else {
          if (graphMatrix[i][j] !== 0 && graphMatrix[i][j] !== 1) {
            throw new CustomError(
              "An unweighted input matrix must contain only 0s and 1s",
              422
            );
          }
        }
      }
    }
  }
  const n = graphMatrix.length;

  const visited = new Array(n).fill(0);
  const paths = [];
  const complete = [];
  let currentPath = [];
  let tempPath = [];

  if (options.graph_type === "matrix_graph") {
    visited[startNode] = 1;
    tempPath.push(startNode);

    function allVisited() {
      return visited.every((vertex) => vertex === 1);
    }
    function generateStep(cur, next, mode = 0, completed = false) {
      return [cur, next, mode, [], completed];
    }

    function findAllPaths(currentVertex) {
      for (let i = 0; i < n; i++) {
        if (graphMatrix[currentVertex][i] === 1 && visited[i] === 0) {
          visited[i] = 1;
          tempPath.push(i);

          const forwardStep = generateStep(currentVertex, i, 0);
          currentPath.push(forwardStep);
          complete.push(forwardStep);

          if (allVisited()) {
            // Generate completion step (if cycle is complete)
            const completionStep = generateStep(
              i,
              startNode,
              2,
              graphMatrix[i][startNode] === 1
            );
            currentPath.push(completionStep);
            complete.push(completionStep);

            // Add path to result (only if cycle is complete)
            if (completionStep.completed) {
              paths.push([...currentPath]);
            }
          } else {
            // Recur for next neighbor
            findAllPaths(i);
          }

          // Backtrack: remove current vertex from tempPath and mark as unvisited
          tempPath.pop();
          visited[i] = 0;

          // Generate backward step only if we're backtracking from a non-completed path
          if (
            tempPath.length > 1 ||
            (tempPath.length === 1 &&
              !currentPath[currentPath.length - 1].completed)
          ) {
            const backwardStep = generateStep(i, currentVertex, 1);
            currentPath.push(backwardStep);
            complete.push(backwardStep);
          }

          // If we're back at the starting vertex and the last step wasn't a completion, add a dead-end step
          if (
            tempPath.length === 1 &&
            !currentPath[currentPath.length - 1].completed
          ) {
            const deadEndStep = generateStep(i, startNode, 2, false);
            currentPath.push(deadEndStep);
            paths.push([...currentPath]); // Add dead-end path to result
            currentPath = []; // Reset currentPath for next iteration
          }
        }
      }
    }

    findAllPaths(startNode);
  } else if (options.graph_type === "adjacency_list") {
    throw new CustomError("Adjacency list is not supported Yet", 422);
  } else {
    throw new CustomError("Invalid graph type", 422);
  }
  console.log(paths, complete);
  return { paths, complete };
}

module.exports = { HamiltonianCycleGenerator };

// 0 - 1 2 3 7
// 1 - 0 4 5
// 2 - 0 5 6
// 3 - 0 4 10
// 4 - 1 3 8
// 5 - 1 2 8 9
// 6 - 2 7 9
// 7 - 0 6 10
// 8 - 4 5 10
// 9 - 5 6 10
// 10 - 3 7 8 9
// const herschel_graph = [
//   [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
//   [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
//   [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
//   [0, 1, 0, 1, 0, 0x , 0, 0, 1, 0, 0],
//   [0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
//   [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
//   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
//   [0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
//   [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0],
// ];
