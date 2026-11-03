
const Gameboard = (function () {
  const SIZE = 9;
  let board = Array(SIZE).fill("");

  const getBoard = () => [...board];

  const placeMark = (index, mark) => {
    const isOnBoard = Number.isInteger(index) && index >= 0 && index < SIZE;
    if (!isOnBoard || board[index] !== "") return false;
    board[index] = mark;
    return true;
  };

  const reset = () => {
    board = Array(SIZE).fill("");
  };

  return { getBoard, placeMark, reset };
})();


function createPlayer(name, mark) {
  let score = 0;

  const getName = () => name;
  const setName = (newName) => { name = newName; };
  const getMark = () => mark;
  const getScore = () => score;
  const addPoint = () => { score++; };
  const resetScore = () => { score = 0; };

  return { getName, setName, getMark, getScore, addPoint, resetScore };
}

const GameController = (function () {
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const players = [createPlayer("Player X", "X"), createPlayer("Player O", "O")];
  let currentIndex = 0;
  let status = "playing"; 
  let winner = null;
  let winningLine = null;

  const findWinningLine = (board) =>
    WIN_LINES.find(
      ([a, b, c]) => board[a] !== "" && board[a] === board[b] && board[a] === board[c]
    ) ?? null;

  const playRound = (index) => {
    if (status !== "playing") {
      return { ok: false, reason: "The game is over. Start a new round." };
    }

    const player = players[currentIndex];
    if (!Gameboard.placeMark(index, player.getMark())) {
      return { ok: false, reason: "Invalid move. Pick an empty square (0-8)." };
    }

    const board = Gameboard.getBoard();
    const line = findWinningLine(board);

    if (line) {
      status = "win";
      winner = player;
      winningLine = line;
      player.addPoint();
    } else if (board.every((cell) => cell !== "")) {
      status = "tie";
    } else {
      currentIndex = currentIndex === 0 ? 1 : 0;
    }

    return { ok: true, status };
  };

  const newRound = () => {
    Gameboard.reset();
    currentIndex = 0;
    status = "playing";
    winner = null;
    winningLine = null;
  };

  const restartGame = () => {
    players.forEach((p) => p.resetScore());
    newRound();
  };

  const setPlayerNames = (nameX, nameO) => {
    players[0].setName(nameX.trim() || "Player X");
    players[1].setName(nameO.trim() || "Player O");
  };

  const getState = () => ({
    board: Gameboard.getBoard(),
    currentPlayer: {
      name: players[currentIndex].getName(),
      mark: players[currentIndex].getMark(),
    },
    status,
    winner: winner ? { name: winner.getName(), mark: winner.getMark() } : null,
    winningLine,
    players: players.map((p) => ({
      name: p.getName(),
      mark: p.getMark(),
      score: p.getScore(),
    })),
  });

  return { playRound, newRound, restartGame, setPlayerNames, getState };
})();

// ---- Console "UI" to prove the logic works end-to-end ----
function printBoard() {
  const b = GameController.getState().board.map((cell) => cell || " ");
  console.log(
    `\n ${b[0]} | ${b[1]} | ${b[2]}\n---+---+---\n ${b[3]} | ${b[4]} | ${b[5]}\n---+---+---\n ${b[6]} | ${b[7]} | ${b[8]}\n`
  );
}

function playMove(index) {
  const result = GameController.playRound(index);
  if (!result.ok) {
    console.log(result.reason);
    return;
  }
  printBoard();

  const state = GameController.getState();
  if (state.status === "win") console.log(`${state.winner.name} (${state.winner.mark}) wins!`);
  if (state.status === "tie") console.log("It's a tie!");
}

// Demo: X wins along the top row.
console.log("--- Demo game: X should win the top row ---");
[0, 3, 1, 4, 2].forEach(playMove);
GameController.newRound();
console.log("--- Board cleared. Your turn: playMove(0) to playMove(8) ---");