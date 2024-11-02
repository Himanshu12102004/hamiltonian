/**
 *
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

export default AdjacencyGraphToMatrixGraph;
