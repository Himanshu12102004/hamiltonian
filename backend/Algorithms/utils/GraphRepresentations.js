// Graph Representations
// This is a utility function that converts an adjacency graph to a matrix graph.
// and Matrix Graph to Adjacency Graph

const { CustomError } = require("../../utils/CustomError");

/**
 * @param {Array<Array<number>>} adjacency_graph This is the adjacency graph that is to be converted to a matrix graph
 * @description This is the adjacency graph that is to be converted to a matrix graph
 * @returns {Array<Array<number>>} The matrix graph
 */

function AdjacencyGraphToMatrixGraph(adjacency_graph) {
  const matrix_graph = Array(adjacency_graph.length)
    .fill(0)
    .map(() => Array(adjacency_graph.length).fill(0));

  for (let i = 0; i < adjacency_graph.length; i++) {
    for (let j = 0; j < adjacency_graph[i].length; j++) {
      matrix_graph[i][adjacency_graph[i][j]] = 1;
    }
  }

  return matrix_graph;
}

/**
 *
 * @param {Array<Array<number>>} matrix_graph This is the matrix graph that is to be converted to an adjacency graph
 * @description This is the matrix graph that is to be converted to an adjacency graph
 * @returns {Array<Array<number>>} The adjacency graph
 */

function MatrixGraphToAdjacencyGraph(matrix_graph) {
  // Error checking
  if (!matrix_graph || !matrix_graph.length) {
    throw new CustomError("Invalid matrix graph", 422);
  }
  // size check of each row

  for (let i = 0; i < matrix_graph.length; i++) {
    if (matrix_graph[i].length !== matrix_graph.length) {
      throw new CustomError(
        `Invalid matrix graph, Row ${i + 1} is invalid`,
        422
      );
    }
  }

  const adjacency_graph = Array(matrix_graph.length);

  for (let i = 0; i < matrix_graph.length; i++) {
    adjacency_graph[i] = [];
    for (let j = 0; j < matrix_graph[i].length; j++) {
      if (matrix_graph[i][j] === 1) {
        adjacency_graph[i].push(j);
      }
    }
  }

  return adjacency_graph;
}

module.exports = { AdjacencyGraphToMatrixGraph, MatrixGraphToAdjacencyGraph };
