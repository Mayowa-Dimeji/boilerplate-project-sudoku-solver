class SudokuSolver {
  validate(puzzleString) {
    // Validate if puzzleString is exactly 81 characters long and contains only valid characters ('1'-'9' or '.')
    return /^[1-9\.]{81}$/.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStartIdx = row * 9;
    const rowEndIdx = rowStartIdx + 9;
    const rowValues = puzzleString.slice(rowStartIdx, rowEndIdx);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colValues = [];
    for (let i = column; i < 81; i += 9) {
      colValues.push(puzzleString[i]);
    }
    return !colValues.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionStartRow = Math.floor(row / 3) * 3;
    const regionStartCol = Math.floor(column / 3) * 3;
    for (let i = regionStartRow; i < regionStartRow + 3; i++) {
      for (let j = regionStartCol; j < regionStartCol + 3; j++) {
        if (puzzleString[i * 9 + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return { error: "Invalid puzzle string" };
    }

    const puzzleArray = puzzleString.split("");

    if (this.solveSudoku(puzzleArray)) {
      return { solution: puzzleArray.join("") };
    } else {
      return { error: "Puzzle cannot be solved" };
    }
  }

  solveSudoku(puzzleArray) {
    const emptyCell = this.findEmptyCell(puzzleArray);
    if (!emptyCell) {
      return true; // Puzzle solved
    }

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      const value = num.toString();
      if (this.isValidPlacement(puzzleArray, row, col, value)) {
        puzzleArray[row * 9 + col] = value;
        if (this.solveSudoku(puzzleArray)) {
          return true;
        }
        puzzleArray[row * 9 + col] = "."; // Backtrack
      }
    }
    return false; // No valid solution found
  }

  findEmptyCell(puzzleArray) {
    for (let i = 0; i < 81; i++) {
      if (puzzleArray[i] === ".") {
        return [Math.floor(i / 9), i % 9];
      }
    }
    return null;
  }

  isValidPlacement(puzzleArray, row, col, value) {
    const puzzleString = puzzleArray.join("");
    return (
      this.checkRowPlacement(puzzleString, row, col, value) &&
      this.checkColPlacement(puzzleString, row, col, value) &&
      this.checkRegionPlacement(puzzleString, row, col, value)
    );
  }
}

module.exports = SudokuSolver;
