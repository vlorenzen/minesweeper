import { useEffect, useState } from "react";

type Props = {
  boardSize: number;
  secToMinSec: (time: number) => string;
};

const HighScore = ({ boardSize, secToMinSec }: Props) => {
  const [highScore, setHighScore] = useState<number[]>([]);

  useEffect(() => {
    const store = localStorage.getItem(`highScore${boardSize}`);
    if (store) return setHighScore(JSON.parse(store));
    setHighScore([]);
  }, [boardSize]);

  return (
    <div>
      <h1>
        Hight Score for {boardSize}x{boardSize}
      </h1>
      {highScore.length > 0 ? (
        <ol>
          {highScore.map((time, key) => {
            return <li key={`${time}-${key}`}>{secToMinSec(time)}</li>;
          })}
        </ol>
      ) : (
        <span>Couldn't find any high scores.</span>
      )}
    </div>
  );
};

export default HighScore;
