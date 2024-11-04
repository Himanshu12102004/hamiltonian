const { CustomError } = require("../utils/CustomError");
const { MatrixGraphToAdjacencyGraph } = require("./utils/GraphRepresentations");

/**
 * Finds all Hamiltonian cycles in a given graph represented as an adjacency list.
 * A Hamiltonian cycle is a cycle that visits each vertex exactly once and returns to the starting vertex.
 *
 * @typedef {number[][]} AdjacencyList - Array where index i contains an array of vertices adjacent to vertex i
 *
 * @typedef {Object} HamiltonianCycle
 * @property {number} from - Starting vertex of the step; -1 if the cycle is completed or dead end
 * @property {number} to - Ending vertex of the step; -1 if the cycle is completed or dead end
 * @property {number} TravelMode - forward = 0; backward = 1; pause = 2; pause either when on a dead end or when the cycle is completed
 * @property {Array<number>} nodes - empty when not a dead end otherwise contains the nodes that are visited
 * @property {boolean} completed - true if the hamiltonian cycle is found else false
 *
 * @param {AdjacencyList} graph - Array where each element is an array of neighboring vertices
 * @param {number} [startNode=0] - Starting vertex for the Hamiltonian cycle
 * @param {Object} [options] - Optional configuration parameters
 * @param {string} [options.graph_type="adjacency_list"] - Type of graph representation
 * @param {boolean} [options.test=false] - Flag to test the function should be set to true only when testing
 *
 * @throws {Error} If the graph has less than 3 vertices
 * @throws {Error} If the graph type is not supported
 *
 * @returns {Object} Object containing paths (possible Hamiltonian paths) and complete (all steps taken)
 * @example
 * // Adjacency list representation
 * const graph = [[3], [0, 2], [1, 3], [0, 2]];
 * const result = HamiltonianCycleGenerator(graph, 0, { graph_type: "adjacency_list" });
 */
function HamiltonianCycleGenerator(
  graph = [[]],
  startNode = 0,
  options = {
    graph_type: "adjacency_list",
    test: false,
  },
  Socket = null
) {
  Socket.sendMessage(
    "HamiltonianCycle",
    "Generating Hamiltonian Cycle of the Graph"
  );
  if (graph.length == 0) {
    Socket.sendMessage("HamiltonianCycle", "Graph is empty");
    // todo - Change the status code to valid status code
    throw new CustomError("Graph is empty", 400);
  }

  if (options.graph_type == "adjacency_list") {
    Socket.sendMessage(
      "HamiltonianCycle",
      "Graph is already in adjacency list format"
    );
    // * do nothing as the graph is already in adjacency list format
  } else if (options.graph_type == "matrix_graph") {
    Socket.sendMessage(
      "HamiltonianCycle",
      "Converting Graph to adjacency list format"
    );
    graph = MatrixGraphToAdjacencyGraph(graph);
  } else {
    Socket.sendMessage(
      "HamiltonianCycle",
      "Either Graph type is not supported or invalid"
    );
    // todo - Change the status code to valid status code
    throw new CustomError("Either Graph type is not supported or invalid", 400);
  }

  // ? Handling special case when the graph has only 2 vertices
  if (graph.length == 2) {
    if (options.test) {
      return [];
    }
    const paths = [
      [0, 1, 0, [], false],
      [-1, -1, 2, [0, 1], false],
    ];
    const complete = [...paths];
    return {
      paths,
      complete,
    };
  }
  // ? Handling special case when the graph has only 1 vertices
  if (graph.length == 1) {
    if (options.test) {
      return [[0]];
    }
    const paths = [[-1, -1, 2, [0], true]];
    const complete = [...paths];
    return {
      paths,
      complete,
    };
  }

  const n = graph.length;
  const visited = new Array(n).fill(0);
  const paths = [];
  const complete = [];
  let currentPath = [];
  let tempPath = [];
  let testPaths = [];
  Socket.sendMessage("HamiltonianCycle", "Initializing variables");

  visited[startNode] = 1;
  tempPath.push(startNode);
  Socket.sendMessage("HamiltonianCycle", "Added start node to the path");

  function allVisited() {
    return visited.every((vertex) => vertex === 1);
  }

  function isAdjacent(vertex1, vertex2) {
    return graph[vertex1].includes(vertex2);
  }

  function generateStep(cur, next, mode = 0, completed = false) {
    return [cur, next, mode, allVisited() ? [...tempPath] : [], completed];
  }
  Socket.sendMessage("HamiltonianCycle", "Generated Helper functions");

  Socket.sendMessage("HamiltonianCycle", "Starting to find all paths");
  function findAllPaths(currentVertex) {
    for (const nextVertex of graph[currentVertex]) {
      if (visited[nextVertex] === 0) {
        visited[nextVertex] = 1;
        tempPath.push(nextVertex);

        const forwardStep = generateStep(currentVertex, nextVertex, 0);
        currentPath.push(forwardStep);
        complete.push(forwardStep);

        if (allVisited()) {
          const isCompleteCycle = isAdjacent(nextVertex, startNode);
          const completionStep = generateStep(nextVertex, startNode, 2, false);
          const deadEndStep = generateStep(-1, -1, 2, true);
          currentPath.push(completionStep);
          currentPath.push(deadEndStep);

          complete.push(completionStep);
          complete.push(deadEndStep);

          if (isCompleteCycle) {
            paths.push([...currentPath]);
            testPaths.push([...tempPath, startNode]);
          }
        } else {
          findAllPaths(nextVertex);
        }

        tempPath.pop();
        visited[nextVertex] = 0;

        if (
          tempPath.length > 1 ||
          (tempPath.length === 1 &&
            !currentPath[currentPath.length - 1].completed)
        ) {
          const backwardStep = generateStep(nextVertex, currentVertex, 1);
          currentPath.push(backwardStep);
          complete.push(backwardStep);
        }

        if (
          tempPath.length === 1 &&
          !currentPath[currentPath.length - 1].completed
        ) {
          const deadEndStep = generateStep(nextVertex, startNode, 2, false);
          currentPath.push(deadEndStep);
          paths.push([...currentPath]);
          currentPath = [];
        }
      }
    }
  }
  Socket.sendMessage("HamiltonianCycle", "Finished finding all paths");

  findAllPaths(startNode);

  if (options.test) {
    return testPaths;
  }
  return {
    paths: paths,
    complete: complete,
  };
}

module.exports = { HamiltonianCycleGenerator };
