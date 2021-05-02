import { GameBoard, Tile } from "../../utils/boardTypes";
import Square from "./Square";

type Props = {
  gameBoard: GameBoard;
  handleOpenTile: (tile: Tile) => void;
  handleMarkingTile: ({ row, col }: Tile) => void;
};

const Board = ({ gameBoard, handleOpenTile, handleMarkingTile }: Props) => {
  const handleLeftClick = (e: React.MouseEvent, tile: Tile) => {
    e.preventDefault();
    handleOpenTile(tile);
  };

  const handleRightClick = (e: React.MouseEvent, tile: Tile) => {
    e.preventDefault();
    handleMarkingTile(tile);
  };

  return (
    <div>
      {gameBoard.map((row, r) => (
        <div className="row" key={`row ${r}`}>
          {row.map((tile, c) => (
            <Square
              key={`column ${c}`}
              cssClass={`block ${!tile.open ? "hidden" : tile.isMine ? "gameOver" : "open"}`}
              tile={tile}
              leftClick={handleLeftClick}
              rightClick={handleRightClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
