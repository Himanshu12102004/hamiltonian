const { CustomError } = require('../utils/CustomError');
const { MatrixGraphToAdjacencyGraph } = require('./utils/GraphRepresentations');

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
    graph_type: 'adjacency_list',
    test: false,
  },
  Socket = null
) {
  Socket.sendMessage(
    'HamiltonianCycle',
    'Generating Hamiltonian Cycle of the Graph'
  );
  if (graph.length == 0) {
    Socket.sendMessage('HamiltonianCycle', 'Graph is empty');
    // todo - Change the status code to valid status code
    throw new CustomError('Graph is empty', 400);
  }

  if (options.graph_type == 'adjacency_list') {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Graph is already in adjacency list format'
    );
    // * do nothing as the graph is already in adjacency list format
  } else if (options.graph_type == 'matrix_graph') {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Converting Graph to adjacency list format'
    );
    graph = MatrixGraphToAdjacencyGraph(graph);
    console.log(graph);
  } else {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Either Graph type is not supported or invalid'
    );
    // todo - Change the status code to valid status code
    throw new CustomError('Either Graph type is not supported or invalid', 400);
  }
  if (options.graph_type == 'adjacency_list') {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Graph is already in adjacency list format'
    );
    // * do nothing as the graph is already in adjacency list format
  } else if (options.graph_type == 'matrix_graph') {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Converting Graph to adjacency list format'
    );
    graph = MatrixGraphToAdjacencyGraph(graph);
    console.log(graph);
  } else {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Either Graph type is not supported or invalid'
    );
    // todo - Change the status code to valid status code
    throw new CustomError('Either Graph type is not supported or invalid', 400);
  }
  if (options.graph_type == 'adjacency_list') {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Graph is already in adjacency list format'
    );
    // * do nothing as the graph is already in adjacency list format
  } else if (options.graph_type == 'matrix_graph') {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Converting Graph to adjacency list format'
    );
    graph = MatrixGraphToAdjacencyGraph(graph);
  } else {
    Socket.sendMessage(
      'HamiltonianCycle',
      'Either Graph type is not supported or invalid'
    );
    // todo - Change the status code to valid status code
    throw new CustomError('Either Graph type is not supported or invalid', 400);
  }

  const n = graph.length;
  const visited = new Array(n).fill(0);
  let paths = [];
  paths.push([]);
  const complete = [];
  let tempPath = [startNode];
  let testPaths = [];
  Socket.sendMessage('HamiltonianCycle', 'Initializing variables');

  visited[startNode] = 1;
  Socket.sendMessage('HamiltonianCycle', 'Added start node to the path');

  function allVisited() {
    return visited.every((vertex) => vertex === 1);
  }

  function generateStep(cur, next, mode = 0, completed = false) {
    let arr = [];
    for (let i = 0; i < visited.length; i++) {
      if (visited[i]) arr.push(i);
    }
    return [cur, next, mode, arr, completed];
  }

  function isAdjacent(cur, next) {
    return graph[cur].includes(next);
  }

  Socket.sendMessage('HamiltonianCycle', 'Generated Helper functions');
  Socket.sendMessage('HamiltonianCycle', 'Starting to find all paths');
  function findAllPaths(cur, start, pathArray) {
    if (allVisited() && cur == start) {
      complete.push(generateStep(-1, -1, 2, true));
      paths.push([...pathArray, complete.length - 1]);
      return;
    }
    let failed = true;
    for (let i = 0; i < graph[cur].length; i++) {
      if (
        visited[graph[cur][i]] != 1 ||
        (graph[cur][i] == start && allVisited())
      ) {
        failed = false;
        complete.push([cur, graph[cur][i], 0, [], false]);
        pathArray.push(complete.length - 1);
        tempPath.push(graph[cur][i]);
        visited[graph[cur][i]] = 1;
        findAllPaths(graph[cur][i], start, pathArray);
        pathArray.pop();
        if (graph[cur][i] != startNode) {
          visited[graph[cur][i]] = 0;
          tempPath.pop();
        }
        complete.push([cur, graph[cur][i], 1, [], false]);
      }
    }
    if (failed) {
      complete.push(generateStep(-1, -1, 2, false));
      paths.push([...pathArray, complete.length - 1]);
    }
  }

  Socket.sendMessage('HamiltonianCycle', 'Finished finding all paths');

  findAllPaths(startNode, startNode, []);
  console.log(paths);
  if (options.test) {
    console.log(testPaths);
    return testPaths;
  }
  paths.shift();
  return {
    paths: paths,
    complete: complete,
  };
}

module.exports = { HamiltonianCycleGenerator };
