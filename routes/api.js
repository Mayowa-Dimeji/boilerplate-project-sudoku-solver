"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (!/^[1-9.]+$/.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    const row = coordinate.charCodeAt(0) - "A".charCodeAt(0);
    const column = parseInt(coordinate[1], 10) - 1;

    if (
      !/^[A-I][1-9]$/.test(coordinate) ||
      row < 0 ||
      row > 8 ||
      column < 0 ||
      column > 8
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (puzzle[row * 9 + column] === value) {
      return res.json({ valid: true });
    }

    const conflicts = [];

    if (!solver.checkRowPlacement(puzzle, row, column, value)) {
      conflicts.push("row");
    }

    if (!solver.checkColPlacement(puzzle, row, column, value)) {
      conflicts.push("column");
    }

    if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
      conflicts.push("region");
    }

    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    if (!/^[1-9.]+$/.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    const result = solver.solve(puzzle);

    if (result.error) {
      return res.json(result);
    }

    return res.json(result);
  });
};
