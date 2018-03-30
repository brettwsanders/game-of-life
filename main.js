(function() {
    // elements
    const sizeInput = document.getElementById("size");
    const table = document.getElementById("board");

    // values
    const size = +sizeInput.value;

    // functions
    const emptyBoard = table => {
        while (table.lastChild) {
            table.removeChild(table.lastChild);
        }
    };

    const createBoard = (table, size) => {
        emptyBoard(table);
        for (let i = 0; i < size; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    };

    const toggleCell = event => {
        const cell = event.target;
        if (!cell.className) {
            cell.classList.add('alive');
        } else {
            cell.classList.remove('alive');
        }
    };

    // event handlers
    sizeInput.addEventListener("change", () => createBoard(table, +sizeInput.value));
    table.addEventListener("click", event => toggleCell(event));

    // init
    createBoard(table, size);
})();
