export default function CheckBanner({ gameState, inCheck }) {
  if (!gameState || gameState.gameStatus !== "playing" || !inCheck) {
    return null;
  }

  const isPlayerTurn = gameState.turn === gameState.playerColor;
  const message = isPlayerTurn ? "You are in check" : "Bot in check";

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
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
      {message}
    </div>
  );
}
