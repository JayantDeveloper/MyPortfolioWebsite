export default function GameOverOverlay({ gameState, onRematch, onMenu }) {
  if (!gameState || gameState.gameStatus !== "over") {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(4,1,0,.84)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: 50,
            height: 1,
            background: "linear-gradient(90deg,transparent,#c8a96e)",
          }}
        />
        <span style={{ color: "#c8a96e", fontSize: "1.3rem" }}>♛</span>
        <div
          style={{
            width: 50,
            height: 1,
            background: "linear-gradient(90deg,#c8a96e,transparent)",
          }}
        />
      </div>

      <div
        style={{
          fontFamily: '"Palatino Linotype",serif',
          color: "#c8a96e",
          fontSize: "clamp(2rem,5vw,3rem)",
          fontWeight: 400,
          marginBottom: ".5rem",
          letterSpacing: ".06em",
          textShadow: "0 0 40px rgba(200,169,110,.5)",
        }}
      >
        Game Over
      </div>

      <div
        style={{
          fontFamily: '"Palatino Linotype",serif',
          color: "#f0d9b5",
          fontSize: "1.1rem",
          marginBottom: "2.5rem",
          letterSpacing: ".06em",
          opacity: 0.9,
        }}
      >
        {gameState.gameResult}
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={onRematch}
          style={{
            fontFamily: '"Palatino Linotype",serif',
            fontSize: ".9rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#150800",
            background:
              "linear-gradient(135deg,#a87e28 0%,#e8c870 50%,#a87e28 100%)",
            border: "none",
            padding: "13px 38px",
            borderRadius: 4,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(200,169,110,.4)",
            transition: "all .2s",
            fontWeight: "bold",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
        >
          ↺ &nbsp;Rematch
        </button>

        <button
          onClick={onMenu}
          style={{
            fontFamily: '"Palatino Linotype",serif',
            fontSize: ".9rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#c8a96e",
            background: "transparent",
            border: "1.5px solid rgba(200,169,110,.38)",
            padding: "13px 38px",
            borderRadius: 4,
            cursor: "pointer",
            transition: "all .2s",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.borderColor = "rgba(200,169,110,.8)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.borderColor = "rgba(200,169,110,.38)";
          }}
        >
          Menu
        </button>
      </div>
    </div>
  );
}
