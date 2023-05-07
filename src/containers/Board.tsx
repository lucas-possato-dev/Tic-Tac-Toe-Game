import React from "react";
import Square from "../components/Square";
type Player = "X" | "O" | "None" | null;
import Switch from "react-switch";

const chooseWinner = (squares: Player[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Board = () => {
  const [squares, setSquares] = React.useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = React.useState<"X" | "O">(
    Math.round(Math.random() * 1) === 1 ? "X" : "O"
  );
  const [winner, setWinner] = React.useState<Player>(null);
  const [isSwitchOn, setIsSwitchOn] = React.useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  const reset = () => {
    setSquares(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer(Math.round(Math.random() * 1) === 1 ? "X" : "O");
  };

  function setSquareValue(i: number) {
    const newData = squares.map((value, index) => {
      if (i === index) {
        return currentPlayer;
      }
      return value;
    });
    setSquares(newData);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }

  React.useEffect(() => {
    const win = chooseWinner(squares);
    if (win) {
      setWinner(win);
    }
    if (!win && !squares.filter((square) => !square).length) setWinner("None");
  }, [squares]);

  const handleChange = () => {
    const newTheme = isSwitchOn ? "light" : "dark";
    setIsSwitchOn(!isSwitchOn);
    localStorage.setItem("theme", newTheme);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsSwitchOn(true);
    }
  }, []);

  return (
    <>
      <div className="container">
        {isSwitchOn ? (
          <h1 style={{ fontSize: "1rem" }}>Dark</h1>
        ) : (
          <h1 style={{ fontSize: "1rem" }}>Light</h1>
        )}
        <Switch
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#2A2AB6"
          onChange={handleChange}
          checked={isSwitchOn}
        />
        {!winner && <p>Ei, {currentPlayer}, é a sua vez!</p>}
        {winner && winner !== "None" && <p>Parabéns, {winner}! Você ganhou!</p>}
        {winner && winner === "None" && <p>Vish, deu velha!</p>}

        <div className="grid">
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <Square
                winner={winner}
                key={index}
                onClick={() => setSquareValue(index)}
                value={squares[index]}
              />
            ))}
        </div>
        <button className="reset" onClick={reset}>
          RESET
        </button>
      </div>
      <style>{`
        body {
          background-color: ${isSwitchOn ? "black" : "white"};
          color: ${isSwitchOn ? "white" : "black"};
        }
      `}</style>
    </>
  );
};

export default Board;
