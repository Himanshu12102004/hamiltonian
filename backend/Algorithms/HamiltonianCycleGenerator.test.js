const { HamiltonianCycleGenerator } = require("./HamiltonianCycleGenerator");
const { CustomError } = require("../utils/CustomError");
const { describe, it, expect } = require("@jest/globals");

describe("Hamiltonian Cycle Generator", () => {
  it("Test Number 1: should generate a Hamiltonian cycle for a complete graph", () => {
    const graph = [
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 1, 0],
    ];
    const cycle = HamiltonianCycleGenerator(
      graph,
      0,
      {
        test: true,
        graph_type: "matrix_graph",
      },
      { sendMessage: () => {} }
    );
    expect(cycle).toEqual([
      [0, 1, 2, 3, 0],
      [0, 1, 3, 2, 0],
      [0, 2, 1, 3, 0],
      [0, 2, 3, 1, 0],
      [0, 3, 1, 2, 0],
      [0, 3, 2, 1, 0],
    ]);
  });

  it("Test Number 2: should generate a Hamiltonian cycle for a complete graph", () => {
    const graph = [
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0],
    ];
    const cycle = HamiltonianCycleGenerator(
      graph,
      0,
      {
        test: true,
        graph_type: "matrix_graph",
      },
      { sendMessage: () => {} }
    );
    // array with no elements
    expect(cycle).toEqual([
      [0, 1, 2, 3, 0],
      [0, 3, 2, 1, 0],
    ]);
  });

  it("should throw an error for an invalid graph", () => {
    const invalidGraph = [
      [0, 1],
      [1, 0, 1],
    ];
    expect(() =>
      HamiltonianCycleGenerator(
        invalidGraph,
        0,
        {
          test: true,
          graph_type: "matrix_graph",
        },
        { sendMessage: () => {} }
      )
    ).toThrow(CustomError);
  });

  it("should throw an error for an empty graph", () => {
    const emptyGraph = [];
    expect(() =>
      HamiltonianCycleGenerator(
        emptyGraph,
        0,
        {
          test: true,
          graph_type: "matrix_graph",
        },
        { sendMessage: () => {} }
      )
    ).toThrow(CustomError);
  });
});
