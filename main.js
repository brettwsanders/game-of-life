(function() {
    // constants
    const GAME_SPEED = 500;

    // elements
    const sizeInput = document.getElementById("size");
    const table = document.querySelector(".board");
    const beginButton = document.getElementById("begin");
    const boardContainer = document.querySelector(".board-container");

    // values
    let isPlaying = false;
    let intervalId = null;
    let board = null;

    // functions
    const printBoard = board => {
        let result = "";
        for (let row = 0; row < board.length; row++) {
            result += board[row].join(",") + "\n";
        }
        console.log(result);
    };

    const toggleCell = event => {
        const cell = event.target;
        if (!cell.className) {
            cell.classList.add('alive');
        } else {
            cell.classList.remove('alive');
        }
    };

    const renderBoard = board => {
        let newBoard = document.createElement("table");
        newBoard.addEventListener("click", event => toggleCell(event));
        newBoard.classList.add("board");
        for (let row = 0; row < board.length; row++) {
            let newBoardRow = document.createElement("tr");
            for (let col = 0; col < board[0].length; col++) {
                let newBoardCell = document.createElement("td");
                if (board[row][col]) {
                    newBoardCell.classList.add("alive");
                }
                newBoardRow.appendChild(newBoardCell);
            }
            newBoard.appendChild(newBoardRow);
        }
        if (boardContainer.hasChildNodes()) {
            const oldBoard = document.querySelector(".board");
            boardContainer.removeChild(oldBoard);
        }
        boardContainer.appendChild(newBoard);
    }

    const initBoard = size => {
        let newBoard = [];
        for (let row = 0; row < size; row++) {
            newBoard.push([]);
            for (let col = 0; col < size; col++) {
                newBoard[row].push(0);
            }
        }
        return newBoard;
    };

    const getAliveNeighborsCount = (row, col) => {
        let sum = 0;

        if (row > 0) {
            sum += (board[row-1][col-1] || 0); // above left
            sum += board[row-1][col];          // above center
            sum += (board[row-1][col+1] || 0); // above right
        }

        sum += (board[row][col-1] || 0);       // left
        sum += (board[row][col+1] || 0);       // right

        if (row < board.length-1) {
            sum += (board[row+1][col-1] || 0); // below left
            sum += board[row+1][col];          // below center
            sum += (board[row+1][col+1] || 0); // below right
        }

        return sum;
    };

    const nextStep = () => {
        const newBoard = [];
        for (let row = 0; row < board.length; row++) {
            const newRow = [];
            for (let col = 0; col < board[0].length; col++) {
                const aliveNeighborsCount = getAliveNeighborsCount(row, col);
                if (board[row][col] === 1) {
                    // if alive and less than 2 alive neighbors, die
                    if (aliveNeighborsCount < 2) {
                        newRow.push(0);
                    // if alive and 2 or 3 alive neighbors, live
                    } else if (aliveNeighborsCount < 4) {
                        newRow.push(1);
                    // if alive and more than 3 alive neighbors, die
                    } else {
                        newRow.push(0);
                    }
                } else {
                    // if dead and 3 alive neighbors, come alive
                    if (aliveNeighborsCount === 3) {
                        newRow.push(1);
                    } else {
                        newRow.push(0);
                    }
                }
            }
            newBoard.push(newRow);
        }
        board = newBoard;
        renderBoard(newBoard);
    };

    const getCurrentBoard = () => {
        if (!boardContainer.hasChildNodes) return null;
        let currentBoard = [];
        const boardElement = document.querySelector(".board");
        for (let row = 0; row < boardElement.rows.length; row++) {
            const rowElement = boardElement.rows[row];
            const currentRow = [];
            for (let col = 0; col < rowElement.cells.length; col++) {
                const cellElement = rowElement.cells[col];
                if (cellElement.className) {
                    currentRow.push(1);
                } else {
                    currentRow.push(0);
                }
            }
            currentBoard.push(currentRow);
        }
        return currentBoard;
    };

    const startOrStop = () => {
        if (isPlaying) {
            isPlaying = false;
            clearInterval(intervalId);
            beginButton.innerHTML = "Begin!"
        } else {
            board = getCurrentBoard();
            isPlaying = true;
            intervalId = setInterval(nextStep, GAME_SPEED);
            beginButton.innerHTML = "Stop!"
        }
    };

    const createAndRenderBoard = () => {
        const newBoard = initBoard(+sizeInput.value)
        renderBoard(newBoard);
        board = newBoard;
    }

    // event handlers
    sizeInput.addEventListener("change", createAndRenderBoard);
    beginButton.addEventListener("click", startOrStop);

    // init
    createAndRenderBoard();
})();
