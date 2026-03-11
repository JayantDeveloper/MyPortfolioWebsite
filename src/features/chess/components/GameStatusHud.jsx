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
        left: isMobile ? "50%" : "1.25rem",
        transform: isMobile ? "translateX(-50%)" : "translateY(-50%)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? ".5rem" : ".85rem",
        alignItems: isMobile ? "center" : "stretch",
        width: isMobile ? "calc(100% - 1.5rem)" : "auto",
        maxWidth: isMobile ? 340 : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: isMobile ? ".6rem" : ".85rem",
          width: "100%",
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: "stretch",
        }}
      >
        <Clock
          time={gameState.playerColor === "b" ? gameState.wTime : gameState.bTime}
          active={gameState.turn !== gameState.playerColor}
          label="BOT"
        />

        <Clock
          time={gameState.playerColor === "w" ? gameState.wTime : gameState.bTime}
          active={gameState.turn === gameState.playerColor}
          label={`YOU · ${gameState.playerColor === "w" ? "WHITE" : "BLACK"}`}
        />
      </div>

      <div
        style={{
          fontFamily: 'Outfit, sans-serif',
          color: "#d0ad7b",
          fontSize: isMobile ? ".62rem" : ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          opacity: 0.82,
          textAlign: isMobile ? "center" : "left",
          padding: ".15rem .1rem .35rem",
          width: "100%",
        }}
      >
        {gameState.turn === gameState.playerColor ? "YOUR TURN" : "BOT THINKING..."}
      </div>
    </div>
  );
}
