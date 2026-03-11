export default function CheckBanner({ gameState, inCheck }) {
  if (!gameState || gameState.gameStatus !== "playing" || !inCheck) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        fontFamily: '"Palatino Linotype",serif',
        color: "#ff6b5b",
        fontSize: ".82rem",
        letterSpacing: ".22em",
        textTransform: "uppercase",
        background: "rgba(80,0,0,.78)",
        padding: "5px 20px",
        borderRadius: 4,
        border: "1px solid rgba(255,80,60,.5)",
        backdropFilter: "blur(8px)",
      }}
    >
      {gameState.turn === gameState.playerColor
        ? "⚠ You are in check"
        : "⚠ Bot is in check"}
    </div>
  );
}
