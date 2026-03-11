import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CheckBanner from "./components/CheckBanner";
import GameOverOverlay from "./components/GameOverOverlay";
import GameScene from "./components/GameScene";
import GameStatusHud from "./components/GameStatusHud";
import IntroOverlay from "./components/IntroOverlay";
import IntroScene from "./components/IntroScene";
import { useChessGame } from "./useChessGame";

export default function ChessExperience() {
  const {
    phase,
    gameState,
    startGame,
    rematch,
    goToIntro,
    handleSquareClick,
    isCurrentTurnInCheck,
  } = useChessGame();

  const isPlaying = phase === "playing" && Boolean(gameState);

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
            camera={{ position: [0, 10, 5.5], fov: 46 }}
            shadows
            gl={{ antialias: true }}
          >
            <Suspense fallback={null}>
              {isPlaying ? (
                <GameScene gameState={gameState} onSquareClick={handleSquareClick} />
              ) : (
                <IntroScene />
              )}
            </Suspense>
          </Canvas>
        </div>

        <IntroOverlay visible={phase === "intro"} onStart={startGame} />
        <GameStatusHud gameState={isPlaying ? gameState : null} />
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
