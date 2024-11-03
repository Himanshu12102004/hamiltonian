const {
  AdjacencyGraphToMatrixGraph,
  MatrixGraphToAdjacencyGraph,
} = require("./GraphRepresentations");
const { CustomError } = require("../../utils/CustomError");
const { describe, it, expect } = require("@jest/globals");

describe("Graph Representations", () => {
  describe("AdjacencyGraphToMatrixGraph", () => {
    it("should convert an adjacency graph to a matrix graph", () => {
      const adjacencyGraph = [[1, 2], [2], [0, 1]];
      const expectedMatrixGraph = [
        [0, 1, 1],
        [0, 0, 1],
        [1, 1, 0],
      ];
      const result = AdjacencyGraphToMatrixGraph(adjacencyGraph);
      expect(result).toEqual(expectedMatrixGraph);
    });
  });

  describe("MatrixGraphToAdjacencyGraph", () => {
    it("should convert a matrix graph to an adjacency graph", () => {
      const matrixGraph = [
        [0, 1, 1],
        [0, 0, 1],
        [1, 1, 0],
      ];
      const expectedAdjacencyGraph = [[1, 2], [2], [0, 1]];
      const result = MatrixGraphToAdjacencyGraph(matrixGraph);
      expect(result).toEqual(expectedAdjacencyGraph);
    });

    it("should throw an error for an invalid matrix graph", () => {
      const invalidMatrixGraph = [
        [0, 1],
        [1, 0, 1],
      ];
      expect(() => MatrixGraphToAdjacencyGraph(invalidMatrixGraph)).toThrow(
        CustomError
      );
    });

    it("should throw an error for an empty matrix graph", () => {
      const emptyMatrixGraph = [];
      expect(() => MatrixGraphToAdjacencyGraph(emptyMatrixGraph)).toThrow(
        CustomError
      );
    });
  });
});
