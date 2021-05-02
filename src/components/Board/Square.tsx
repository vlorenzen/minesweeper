import { Tile } from "../../utils/boardTypes";

type Props = {
  cssClass: string;
  tile: Tile;
  leftClick: (e: React.MouseEvent, tile: Tile) => void;
  rightClick: (e: React.MouseEvent, tile: Tile) => void;
};

const Square = ({ cssClass, tile, leftClick, rightClick }: Props) => {
  const iconRender = ({ open, marked, isMine }: Tile): string => {
    if (open) {
      if (isMine) return "💥";
      return tile.nextToMines > 0 ? tile.nextToMines.toLocaleString() : "";
    }
    if (marked) return "🚩";
    return "";
  };

  return (
    <div className={cssClass} onClick={(e) => leftClick(e, tile)} onContextMenu={(e) => rightClick(e, tile)}>
      <span>{iconRender(tile)}</span>
    </div>
  );
};

export default Square;
