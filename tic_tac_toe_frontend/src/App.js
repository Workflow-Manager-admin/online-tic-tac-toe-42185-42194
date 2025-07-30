import React, { useState } from 'react';
import './App.css';

// Color palette
const PRIMARY = "#2196F3";   // blue
const SECONDARY = "#4CAF50"; // green
const ACCENT = "#FFC107";    // yellow

// PUBLIC_INTERFACE
function App() {
  // Board setup: 9 elements in an array, initial state null (empty)
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(-1);

  // Check winner each move
  React.useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      setGameOver(true);
    } else if (board.every(cell => cell !== null)) {
      // Draw
      setWinner(null);
      setGameOver(true);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    if (gameOver || board[i]) return;

    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
    setLastMove(i);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setLastMove(-1);
  }

  // PUBLIC_INTERFACE
  function renderStatus() {
    if (winner === 'X' || winner === 'O') {
      return (
        <span className="game-status" style={{ color: winner === 'X' ? PRIMARY : SECONDARY }}>
          Winner: {winner}
        </span>
      );
    } else if (winner === null && gameOver) {
      return <span className="game-status" style={{ color: ACCENT }}>It's a draw!</span>;
    } else {
      return (
        <span className="game-status" style={{ color: xIsNext ? PRIMARY : SECONDARY }}>
          {xIsNext ? "X's Turn" : "O's Turn"}
        </span>
      );
    }
  }

  // PUBLIC_INTERFACE
  function renderRestartButton() {
    return (
      <button
        className="restart-btn"
        style={{ backgroundColor: ACCENT, color: "#222" }}
        onClick={restartGame}
        aria-label="Restart Game"
      >
        Restart Game
      </button>
    );
  }

  // Layout: Header -> Board -> Status/Controls
  return (
    <div className="ttt-container">
      <h1 className="ttt-header" data-testid="header">
        <span style={{ color: PRIMARY }}>Tic</span>
        <span style={{ color: SECONDARY }}>Tac</span>
        <span style={{ color: ACCENT }}>Toe</span>
      </h1>
      <div className="ttt-board-wrapper">
        <Board
          squares={board}
          onSquareClick={handleSquareClick}
          lastMove={lastMove}
          gameOver={gameOver}
        />
      </div>
      <div className="ttt-status-controls">
        {renderStatus()}
        {renderRestartButton()}
      </div>
      <footer className="ttt-footer">
        <span>Modern Tic Tac Toe &mdash; React &bull; Two Player</span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, lastMove, gameOver }) {
  // Use a grid structure, apply light animation for last played cell
  function renderSquare(i) {
    let highlight = i === lastMove;
    let value = squares[i];

    return (
      <button
        className={`ttt-square${highlight ? " ttt-animate" : ""}${value ? " filled" : ""}`}
        key={i}
        onClick={() => onSquareClick(i)}
        disabled={Boolean(value) || gameOver}
        aria-label={value ? `Filled with ${value}` : "Empty"}
      >
        {value}
      </button>
    );
  }

  // Create 3x3 grid
  return (
    <div className="ttt-board">
      {Array(3).fill().map((_, row) =>
        <div className="ttt-board-row" key={row}>
          {Array(3).fill().map((_, col) => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  // Returns 'X', 'O', or null (no winner yet)
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

export default App;
