import { useState, useEffect } from "react";
import { GameBoard, Tile } from "./utils/boardTypes";
import { newBoard } from "./utils/generateBoard";
import Board from "./components/Board";
import HighScore from "./components/HighScore";

function App() {
  const [gameBoard, setGameBoard] = useState<GameBoard>([]);
  const [boardSize, setBoardSize] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(0);
  const [timeCounter, setTimeCounter] = useState(0);

  useEffect(() => {
    if (timeCounter > 1200 || !gameStarted) return;

    const timer = setInterval(() => {
      setTimeCounter((old) => old + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeCounter, gameStarted]);

  useEffect(() => {
    if (flagsLeft !== 0 || gameOver || !gameStarted) return;
    const finalTime = timeCounter;

    const minesLeft = gameBoard.reduce((acc, row) => {
      return (
        acc +
        row.reduce((acc, tile) => {
          if (tile.isMine && !tile.marked) return acc + 1;
          return acc;
        }, 0)
      );
    }, 0);
    if (minesLeft > 0) return setGameOver(true);

    const store = localStorage.getItem(`highScore${boardSize}`);

    if (store) {
      localStorage.setItem(
        `highScore${boardSize}`,
        JSON.stringify([...JSON.parse(store), finalTime].sort((a, b) => a - b).slice(0, 5))
      );
    } else {
      localStorage.setItem(`highScore${boardSize}`, JSON.stringify([finalTime]));
    }

    setGameStarted(false);
  }, [flagsLeft, gameOver, timeCounter, gameBoard, boardSize, gameStarted]);

  const handleNewGame = (bSize: number) => {
    let boardMines: number = Math.floor((bSize * bSize) / 6);

    setFlagsLeft(boardMines);
    setGameBoard(newBoard(bSize, boardMines));
    setGameOver(false);
    setGameStarted(true);
    setTimeCounter(0);
  };

  const openTiles = (tile: Tile, board: GameBoard): GameBoard => {
    let tempBoard = [...gameBoard];
    const boardLength = board.length - 1;
    tempBoard[tile.row][tile.col].open = true;

    if (tile.nextToMines === 0) {
      // lets find the 8 "connecting" tiles
      for (let r = tile.row - 1; r <= tile.row + 1; r++) {
        for (let c = tile.col - 1; c <= tile.col + 1; c++) {
          // Make sure we don't "leave" the board
          if (r >= 0 && r <= boardLength && c >= 0 && c <= boardLength) {
            if (!tempBoard[r][c].open && !tempBoard[r][c].isMine) {
              tempBoard[r][c].open = true;
              openTiles(tempBoard[r][c], tempBoard);
            }
          }
        }
      }
    }

    return tempBoard;
  };

  const handleOpenTile = (tile: Tile) => {
    if (tile.marked || flagsLeft === 0 || gameOver) return;

    setGameBoard(openTiles(tile, gameBoard));

    if (tile.isMine) setGameOver(true);
  };

  const handleMarkingTile = ({ row, col, open }: Tile) => {
    if (open || flagsLeft === 0 || gameOver) return;
    let tempBoard = [...gameBoard];

    if (tempBoard[row][col].marked) {
      tempBoard[row][col].marked = false;
      setFlagsLeft((c) => c + 1);
    } else {
      tempBoard[row][col].marked = true;
      setFlagsLeft((c) => c - 1);
    }

    setGameBoard(tempBoard);
  };

  const secToMinSec = (time: number): string => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);

    const min = m > 0 ? (m <= 9 ? `0${m}` : m) : "00";
    const sec = s > 0 ? (s <= 9 ? `0${s}` : s) : "00";
    return `${min}:${sec}`;
  };

  return (
    <div className="board">
      <div className="gameSettings">
        <button onClick={() => setGameStarted(false)}>View High Score</button>
        <select value={boardSize} onChange={(e) => setBoardSize(parseInt(e.target.value))}>
          <optgroup label="Select Game Size">
            {[15, 20, 30, 40].map((bSize) => (
              <option key={bSize} value={bSize}>
                {bSize} x {bSize}
              </option>
            ))}
          </optgroup>
        </select>
        <button onClick={() => handleNewGame(boardSize)}>Start Game</button>
      </div>

      {gameStarted ? (
        <>
          <div className="information">
            <span>
              <span>🚩 {flagsLeft > 99 ? flagsLeft : flagsLeft > 9 ? `0${flagsLeft}` : `00${flagsLeft}`}</span>
            </span>
            {gameOver && <span className="gameOver"> Game Over! </span>}
            <span>
              <span>{secToMinSec(timeCounter)} ⏱️</span>
            </span>
          </div>

          <Board gameBoard={gameBoard} handleOpenTile={handleOpenTile} handleMarkingTile={handleMarkingTile} />
        </>
      ) : (
        <>
          {timeCounter > 0 && <h2>You cleared the minefield in {secToMinSec(timeCounter)}!</h2>}
          <HighScore boardSize={boardSize} secToMinSec={secToMinSec} />
        </>
      )}
    </div>
  );
}

export default App;
