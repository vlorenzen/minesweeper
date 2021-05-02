import { Mines, GameBoard, Row, Tile } from "./boardTypes";

const getMines = (minesNr: number, boardSize: number): Mines => {
  let minesLocation: Mines = [];
  const randomNr = (nr: number) => Math.floor(Math.random() * nr);

  while (minesLocation.length < minesNr) {
    const mine = { row: randomNr(boardSize), col: randomNr(boardSize) };

    if (!minesLocation.some((m) => m.col === mine.col && m.row === mine.row)) {
      minesLocation.push(mine);
    }
  }

  return minesLocation;
};

const getNumberOfNearByMines = ({ row, col }: Tile, gameBoard: GameBoard) => {
  let board = [...gameBoard];
  let nearByTiles: Row = [];

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      let current = board[r]?.[c];
      if (current) nearByTiles.push(current);
    }
  }

  return nearByTiles.reduce((acc, t) => (t.isMine ? acc + 1 : acc), 0);
};

const newBoardRow = (row: number, nrRows: number, mines: Mines): Row => {
  let rows: Row = [];
  for (let i = 0; i < nrRows; i++) {
    rows = [
      ...rows,
      {
        open: false,
        isMine: mines.some((m) => m.col === i && m.row === row),
        marked: false,
        nextToMines: 0,
        row,
        col: i,
      },
    ];
  }
  return rows;
};

export const newBoard = (boardSize: number, minesNr: number): GameBoard => {
  let board: GameBoard = [];
  let minesLocation = getMines(minesNr, boardSize);

  for (let i = 0; i < boardSize; i++) {
    board = [...board, newBoardRow(i, boardSize, minesLocation)];
  }

  return board.map((row) => {
    return row.map((tile) => {
      return { ...tile, nextToMines: getNumberOfNearByMines(tile, board) };
    });
  });
};
