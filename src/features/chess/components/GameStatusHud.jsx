import Clock from "./Clock";

export default function GameStatusHud({ gameState }) {
  if (!gameState || gameState.gameStatus !== "playing") {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "1.25rem",
        transform: "translateY(-50%)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: ".85rem",
        alignItems: "stretch",
      }}
    >
      <Clock
        time={gameState.playerColor === "b" ? gameState.wTime : gameState.bTime}
        active={gameState.turn !== gameState.playerColor}
        label="BOT"
      />

      <div
        style={{
          fontFamily: '"Palatino Linotype","Book Antiqua",Georgia,serif',
          color: "#d0ad7b",
          fontSize: ".72rem",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          opacity: 0.82,
          textAlign: "left",
          padding: ".35rem .1rem",
        }}
      >
        {gameState.turn === gameState.playerColor ? "YOUR TURN" : "BOT THINKING..."}
      </div>

      <Clock
        time={gameState.playerColor === "w" ? gameState.wTime : gameState.bTime}
        active={gameState.turn === gameState.playerColor}
        label={`YOU · ${gameState.playerColor === "w" ? "WHITE" : "BLACK"}`}
      />
    </div>
  );
}
