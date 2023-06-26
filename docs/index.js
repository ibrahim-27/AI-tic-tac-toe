// Global Variables
gameBoard = Array.from(document.getElementsByClassName('game-board-cell')); // Array of game board cells
refreshButton = document.getElementsByClassName('refresh-btn')[0]; // Refresh button element
player_src = 'src/O.png'; // Image source for player's move
ai_src = 'src/X.png'; // Image source for AI's move
global_board = []; // Array to store the current state of the game board
scoreBoard = [0, 0, 0]; // Array to store the scores [player, tie, AI]
scores = {
    'player': -1,
    'tie': 0,
    'ai': 1
};

// Set click event listeners to all game board cells
function setClickListeners() {
    for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i].addEventListener('click', PlayerTurn);
    }
}

// Remove click event listeners from all game board cells
function removeClickListeners() {
    for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i].removeEventListener('click', PlayerTurn);
    }
}

// Set click event listeners initially
setClickListeners();

// Add click event listener to the refresh button
refreshButton.addEventListener('click', RefreshBoard);

// Update the score based on the result
function UpdateScore(res) {
    let scoreBoardElem = Array.from(document.getElementsByClassName('score-points')); // Array of score elements
    if (res == 'player') {
        scoreBoard[0]++; // Increment player score
        scoreBoardElem[0].textContent = scoreBoard[0]; // Update player score on the UI
    } else if (res == 'ai') {
        scoreBoard[2]++; // Increment AI score
        scoreBoardElem[2].textContent = scoreBoard[2]; // Update AI score on the UI
    } else {
        scoreBoard[1]++; // Increment tie score
        scoreBoardElem[1].textContent = scoreBoard[1]; // Update tie score on the UI
    }

    removeClickListeners(); // Temporarily disable click event listeners
}

// Refresh the game board
function RefreshBoard() {
    global_board = []; // Reset the game board state
    for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i].getElementsByClassName('img')[0].src = ''; // Reset the images on the game board
    }
    setClickListeners(); // Enable click event listeners again
}

// Convert HTML array to game array
function HtmlToList() {
    let board = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i].getElementsByClassName('img')[0].src.includes(ai_src)) {
            board[i] = 'X'; // AI move found at the cell
        } else if (gameBoard[i].getElementsByClassName('img')[0].src.includes(player_src)) {
            board[i] = 'O'; // Player move found at the cell
        } else {
            board[i] = ''; // Empty cell
        }
    }

    return board;
}

// Check if there is a winner
function CheckWinner(board) {
    let temp1, temp2, temp3;

    // Horizontal Win
    for (let i = 0; i < 9; i += 3) {
        temp1 = board[i];
        temp2 = board[i + 1];
        temp3 = board[i + 2];

        if (temp1 == temp2 && temp2 == temp3 && temp1 != '') {
            if (temp1 == 'O') {
                return 'player'; // Player wins horizontally
            } else {
                return 'ai'; // AI wins horizontally
            }
        }
    }

    // Vertical Win
    for (let i = 0; i < 3; i++) {
        temp1 = board[i];
        temp2 = board[i + 3];
        temp3 = board[i + 6];

        if (temp1 == temp2 && temp2 == temp3 && temp1 != '') {
            if (temp1 == 'O') {
                return 'player'; // Player wins vertically
            } else {
                return 'ai'; // AI wins vertically
            }
        }
    }

    // Diagonal Wins
    temp1 = board[0];
    temp2 = board[4];
    temp3 = board[8];
    if (temp1 == temp2 && temp2 == temp3 && temp1 != '') {
        if (temp1 == 'O') {
            return 'player'; // Player wins diagonally
        } else {
            return 'ai'; // AI wins diagonally
        }
    }

    temp1 = board[2];
    temp2 = board[4];
    temp3 = board[6];
    if (temp1 == temp2 && temp2 == temp3 && temp1 != '') {
        if (temp1 == 'O') {
            return 'player'; // Player wins diagonally
        } else {
            return 'ai'; // AI wins diagonally
        }
    }

    // Tie
    let freeSpots = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == '') {
            freeSpots++;
        }
    }

    if (freeSpots == 0) {
        return 'tie'; // It's a tie
    }

    // Returns null by default if no one wins
}

// Handle user input - player's turn
function PlayerTurn(event) {
    const img = event.target.getElementsByClassName('img')[0];
    img.src = player_src;

    global_board = HtmlToList();
    let res = CheckWinner(global_board);
    if (res != null) {
        UpdateScore(res);
        return;
    }

    CompTurn(global_board);

    global_board = HtmlToList();

    res = CheckWinner(global_board);
    if (res != null) {
        UpdateScore(res);
        return;
    }
}

// Perform AI's turn
function CompTurn(board) {
    let bestScore = -Infinity;
    let bestTurn = -1; // Index from 0 to 8

    for (let i = 0; i < board.length; i++) {
        // Skip if the spot is not empty
        if (board[i] != '') {
            continue;
        }

        // Temporary checking the spot
        board[i] = 'X';
        let score = MiniMax(board, false);

        // Free the spot again
        board[i] = '';
        if (score > bestScore) {
            bestScore = score;
            bestTurn = i;
        }
    }

    // Take the optimal turn
    img = gameBoard[bestTurn].getElementsByClassName('img')[0];
    img.src = ai_src;
}

// Minimax algorithm implementation
function MiniMax(board, isMax) {
    let res = CheckWinner(board);
    if (res != null) {
        return scores[res];
    }

    if (isMax) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] != '') {
                continue;
            }

            // Temporary checking the spot
            board[i] = 'X';
            let score = MiniMax(board, false);

            // Free the spot again
            board[i] = '';
            bestScore = Math.max(score, bestScore);
        }

        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] != '') {
                continue;
            }

            // Temporary checking the spot
            board[i] = 'O';
            let score = MiniMax(board, true);

            // Free the spot again
            board[i] = '';
            bestScore = Math.min(score, bestScore);
        }

        return bestScore;
    }
}