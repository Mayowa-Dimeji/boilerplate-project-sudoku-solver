const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver.js");
let solver;

suite("Unit Tests", () => {
  setup(() => {
    solver = new SudokuSolver();
  });

  test("Logic handles a valid puzzle string of 81 characters", () => {
    const puzzleString =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.isTrue(solver.validate(puzzleString));
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    const puzzleString = "123456789abc.....";
    assert.isFalse(solver.validate(puzzleString));
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    const puzzleString = "123456789........";
    assert.isFalse(solver.validate(puzzleString));
  });

  test("Logic handles a valid row placement", () => {
    const puzzleString =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.isTrue(solver.checkRowPlacement(puzzleString, 0, 0, "4"));
  });

  test("Logic handles an invalid row placement", () => {
    const puzzleString =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";

    assert.isFalse(solver.checkRowPlacement(puzzleString, 0, 0, "2"));
  });

  test("Logic handles a valid column placement", () => {
    const puzzleString =
      "15..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.isTrue(solver.checkColPlacement(puzzleString, 0, 0, "4"));
  });

  test("Logic handles an invalid column placement", () => {
    const puzzleString =
      "15..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.isFalse(solver.checkColPlacement(puzzleString, 0, 0, "1"));
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    const puzzleString =
      "15..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.isTrue(solver.checkRegionPlacement(puzzleString, 0, 0, "2"));
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    const puzzleString = "123456789.........";
    assert.isFalse(solver.checkRegionPlacement(puzzleString, 0, 0, "2"));
  });

  test("Valid puzzle strings pass the solver", () => {
    const puzzleString =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    const result = solver.solve(puzzleString);
    assert.property(result, "solution");
    assert.equal(result.solution, puzzleString);
  });

  test("Invalid puzzle strings fail the solver", () => {
    const puzzleString = "123456789........."; // Incomplete puzzle
    const result = solver.solve(puzzleString);
    assert.property(result, "error");
    assert.equal(result.error, "Invalid puzzle string");
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    const incompletePuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const solution =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    const result = solver.solve(incompletePuzzle);
    assert.property(result, "solution");
    assert.equal(result.solution, solution);
  });
});
