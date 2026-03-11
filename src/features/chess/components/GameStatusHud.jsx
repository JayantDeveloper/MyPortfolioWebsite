import Clock from "./Clock";
import useResponsive from "../../../hooks/useResponsive";

export default function GameStatusHud({ gameState }) {
  const { isMobile } = useResponsive();

  if (!gameState || gameState.gameStatus !== "playing") {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? 72 : "50%",
        left: isMobile ? "0.75rem" : "1.25rem",
        transform: isMobile ? "none" : "translateY(-50%)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? ".5rem" : ".85rem",
        alignItems: "stretch",
        maxWidth: isMobile ? 148 : "none",
      }}
    >
      <Clock
        time={gameState.playerColor === "b" ? gameState.wTime : gameState.bTime}
        active={gameState.turn !== gameState.playerColor}
        label="BOT"
      />

      <div
        style={{
          fontFamily: 'Outfit, sans-serif',
          color: "#d0ad7b",
          fontSize: isMobile ? ".62rem" : ".72rem",
          letterSpacing: ".12em",
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
