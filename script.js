// Элементы страницы
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

// Инициализация игры
let board = Array(9).fill(null);
let isGameActive = true;
let currentPlayer = 'X'; // Игрок всегда 'X', ИИ всегда 'O'

// Победные комбинации
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Обновление статуса
function updateStatus(message) {
    statusText.textContent = message;
}

// Проверка победителя
function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            isGameActive = false;
            updateStatus('');
            highlightWinningCells(combination);
            return true;
        }
    }

    // Проверка на ничью
    if (!board.includes(null)) {
        isGameActive = false;
        updateStatus('Ничья!');
        return true;
    }

    return false;
}

// Подсветка победной комбинации
function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].style.backgroundColor = '#4CAF50';
        cells[index].style.color = '#fff';
    });
}

// Ход ИИ
function aiMove() {
    if (!isGameActive) return;

    // Попытка выиграть или выбрать случайную клетку
    let move = null;

    // 1. Проверка, может ли ИИ выиграть
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === null) move = c;
        if (board[a] === 'O' && board[c] === 'O' && board[b] === null) move = b;
        if (board[b] === 'O' && board[c] === 'O' && board[a] === null) move = a;
    }

    // 2. Выбор случайной клетки, если выиграть нельзя
    if (move === null) {
        const availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    // Выполнить ход
    board[move] = 'O';
    cells[move].textContent = 'O';
    cells[move].classList.add('taken');

    // Проверить победителя
    if (!checkWinner()) {
        currentPlayer = 'X';
        updateStatus('твой ход');
    }
}

// Обработчик кликов по клеткам
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (board[index] || !isGameActive || currentPlayer !== 'X') {
        return;
    }

    // Обновление доски
    board[index] = 'X';
    cell.textContent = 'X';
    cell.classList.add('taken');

    // Проверка победителя
    if (!checkWinner()) {
        currentPlayer = 'O';
        updateStatus('Ход ИИ...');
        setTimeout(aiMove, 500); // Небольшая задержка перед ходом ИИ
    }
}

// Сброс игры
function resetGame() {
    board = Array(9).fill(null);
    isGameActive = true;
    currentPlayer = 'X';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
        cell.style.backgroundColor = '';
        cell.style.color = '';
    });

    updateStatus('твой ход');
}

// События
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Начальное сообщение
updateStatus('твой ход');
