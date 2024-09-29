document.addEventListener("DOMContentLoaded", function() {
    createSudokuBoard();
});

function createSudokuBoard() {
    const board = document.getElementById("sudoku-board");
    for (let i = 0; i < 9; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("td");
            let input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function solveSudoku() {
    const board = [];
    const cells = document.querySelectorAll("#sudoku-board input");

    // Convert input values to a 2D array
    for (let i = 0; i < 81; i += 9) {
        let row = [];
        for (let j = 0; j < 9; j++) {
            row.push(cells[i + j].value || ".");
        }
        board.push(row);
    }

    // Validate user input
    if (!isValidBoard(board)) {
        document.getElementById("message").textContent = "No solution exists: Invalid board.";
        return;
    }

    // Solve if valid
    if (solve(board)) {
        for (let i = 0; i < 81; i++) {
            cells[i].value = board[Math.floor(i / 9)][i % 9];
        }
        document.getElementById("message").textContent = "Sudoku solved!";
    } else {
        document.getElementById("message").textContent = "No solution exists.";
    }
}

// Function to validate the input board
function isValidBoard(board) {
    // Check for duplicates in rows, columns, and subgrids
    for (let i = 0; i < 9; i++) {
        let rowSet = new Set();
        let colSet = new Set();
        for (let j = 0; j < 9; j++) {
            // Check row for duplicates
            if (board[i][j] !== "." && rowSet.has(board[i][j])) {
                return false;
            }
            rowSet.add(board[i][j]);

            // Check column for duplicates
            if (board[j][i] !== "." && colSet.has(board[j][i])) {
                return false;
            }
            colSet.add(board[j][i]);
        }
    }

    // Check each 3x3 subgrid for duplicates
    for (let blockRow = 0; blockRow < 9; blockRow += 3) {
        for (let blockCol = 0; blockCol < 9; blockCol += 3) {
            let subgridSet = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let val = board[blockRow + i][blockCol + j];
                    if (val !== "." && subgridSet.has(val)) {
                        return false;
                    }
                    subgridSet.add(val);
                }
            }
        }
    }

    return true;
}

function solve(board) {
    function isSolvable(board, row, column, val) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === val || board[i][column] === val) {
                return false;
            }
        }
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(column / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === val) {
                    return false;
                }
            }
        }
        return true;
    }

    function solveRecursive(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === '.') {
                    for (let num = 1; num <= 9; num++) {
                        let val = num.toString();
                        if (isSolvable(board, row, col, val)) {
                            board[row][col] = val;
                            if (solveRecursive(board)) {
                                return true;
                            }
                            board[row][col] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    return solveRecursive(board);
}
