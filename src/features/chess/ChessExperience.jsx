import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CheckBanner from "./components/CheckBanner";
import GameOverOverlay from "./components/GameOverOverlay";
import GameScene from "./components/GameScene";
import GameStatusHud from "./components/GameStatusHud";
import IntroOverlay from "./components/IntroOverlay";
import IntroScene from "./components/IntroScene";
import useResponsive from "../../hooks/useResponsive";
import { useChessGame } from "./useChessGame";

export default function ChessExperience() {
  const {
    phase,
    gameState,
    startGame,
    rematch,
    goToIntro,
    handleSquareClick,
    clearSelection,
    isCurrentTurnInCheck,
    cancelPremove,
    displayBoard,
    premoveSelection,
    premoveLegalMoves,
    premoveQueue,
    resign,
  } = useChessGame();

  const isPlaying = phase === "playing" && Boolean(gameState);
  const { isMobile } = useResponsive();
  return (
    <div
      style={{
        paddingTop: 56,
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <section
        onContextMenu={(event) => {
          if (!isPlaying || (!premoveQueue.length && !premoveSelection)) {
            return;
          }
          event.preventDefault();
          cancelPremove();
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          background:
            "linear-gradient(160deg,#130700 0%,#381800 45%,#130700 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 30% 40%,rgba(180,100,20,.09) 0%,transparent 60%),radial-gradient(ellipse at 70% 60%,rgba(200,140,40,.07) 0%,transparent 50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <Canvas
            onPointerMissed={
              isPlaying ? () => clearSelection() : undefined
            }
            camera={{ position: [0, 10, 5.5], fov: 46 }}
            shadows
            gl={{ antialias: true }}
          >
            <Suspense fallback={null}>
              {isPlaying ? (
                <GameScene
                  gameState={gameState}
                  displayBoard={displayBoard}
                  onSquareClick={handleSquareClick}
                  premoveSelection={premoveSelection}
                  premoveLegalMoves={premoveLegalMoves}
                  premoveQueue={premoveQueue}
                />
              ) : (
                <IntroScene />
              )}
            </Suspense>
          </Canvas>
        </div>

        <IntroOverlay visible={phase === "intro"} onStart={startGame} />
        <GameStatusHud gameState={isPlaying ? gameState : null} />
        {isPlaying && gameState.gameStatus === "playing" ? (
          <button
            onClick={resign}
            style={{
              position: "absolute",
              right: isMobile ? "1.2rem" : "1.2rem",
              top: isMobile ? "1.5rem" : "50%",
              transform: isMobile ? "none" : "translateY(-50%)",
              zIndex: 10,
              border: "1px solid rgba(200,169,110,.25)",
              color: "#ececf4",
              background: "rgba(17, 17, 19, 0.55)",
              fontFamily: '"Palatino Linotype",serif',
              letterSpacing: ".15em",
              textTransform: "uppercase",
              fontSize: isMobile ? ".66rem" : ".78rem",
              padding: isMobile ? "10px 18px" : "12px 20px",
              borderRadius: 6,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(0,0,0,.28)",
              fontWeight: 500,
              transition: "background .2s, border-color .2s, color .2s, box-shadow .2s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background =
                "linear-gradient(135deg,#5c2320 0%,#a83d38 50%,#5c2320 100%)";
              event.currentTarget.style.borderColor = "rgba(200,169,110,.45)";
              event.currentTarget.style.color = "#ffe1cb";
              event.currentTarget.style.boxShadow = "0 8px 22px rgba(168,61,56,.35)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(17, 17, 19, 0.55)";
              event.currentTarget.style.borderColor = "rgba(200,169,110,.25)";
              event.currentTarget.style.color = "#ececf4";
              event.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,.28)";
            }}
          >
            Resign
          </button>
        ) : null}
        <CheckBanner
          gameState={isPlaying ? gameState : null}
          inCheck={isCurrentTurnInCheck}
        />
        <GameOverOverlay
          gameState={isPlaying ? gameState : null}
          onRematch={rematch}
          onMenu={goToIntro}
        />
      </section>
    </div>
  );
}
