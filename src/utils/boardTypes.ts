export type Tile = {
  open: boolean;
  isMine: boolean;
  marked: boolean;
  nextToMines: number;
  row: number;
  col: number;
};
export type Row = Tile[];
export type GameBoard = Row[];

export type Mines = { row: number; col: number }[];
