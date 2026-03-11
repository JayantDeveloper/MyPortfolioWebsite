import { Environment, OrbitControls } from "@react-three/drei";
import useResponsive from "../../../hooks/useResponsive";
import CameraRig from "./CameraRig";
import ChessBoard from "./ChessBoard";

export default function GameScene({
  gameState,
  displayBoard,
  onSquareClick,
  premoveSelection,
  premoveLegalMoves,
  premoveQueue,
}) {
  const { isMobile } = useResponsive();
  const { turn, playerColor, selected, legalMoves, lastMove, gameStatus } =
    gameState;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 7, -5]} intensity={0.35} color="#ffe0cc" />
      <pointLight position={[0, 7, 0]} intensity={0.6} color="#fff3e0" />
      <Environment preset="apartment" />

      <CameraRig playerColor={playerColor} />
      <OrbitControls
        enablePan={false}
        enableRotate
        enableZoom
        minPolarAngle={Math.PI / 9}
        maxPolarAngle={Math.PI / 2.4}
        minDistance={isMobile ? 7.5 : 6.5}
        maxDistance={isMobile ? 20 : 18}
        target={[0, 0, 0]}
      />

      <ChessBoard
        board={displayBoard ?? gameState.board}
        turn={turn}
        playerColor={playerColor}
        selected={selected}
        legalMoves={legalMoves}
        onSquareClick={onSquareClick}
        lastMove={lastMove}
        gameStatus={gameStatus}
        premoveSelection={premoveSelection}
        premoveLegalMoves={premoveLegalMoves}
        premoveQueue={premoveQueue}
      />
    </>
  );
}
