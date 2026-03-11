import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import useResponsive from "../../../hooks/useResponsive";
import { BOARD_DEPTH_OFFSET, INIT_FEN } from "../constants";
import { fenToBoard, pieceColor, pieceType } from "../logic";
import BoardBase from "./BoardBase";
import BoardName from "./BoardName";
import PieceGeometry from "./pieces/PieceGeometry";

export default function IntroScene() {
  const introBoardRef = useRef(null);
  const introBoard = useMemo(() => fenToBoard(INIT_FEN), []);
  const { isMobile } = useResponsive();

  useFrame((state) => {
    if (introBoardRef.current) {
      introBoardRef.current.rotation.y = state.clock.getElapsedTime() * 0.16;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 12, 5]} intensity={1.3} castShadow />
      <directionalLight position={[-4, 6, -4]} intensity={0.3} color="#ffe0cc" />
      <pointLight position={[0, 6, 0]} intensity={0.7} color="#c8a96e" />
      <Environment preset="apartment" />

      <group
        ref={introBoardRef}
        position={[0, isMobile ? -1.6 : -1.4, -(BOARD_DEPTH_OFFSET + (isMobile ? 0.35 : 0))]}
        rotation={[isMobile ? 0.38 : 0.28, 0, 0]}
      >
        <BoardBase
          getSquareColor={(row, column) =>
            (row + column) % 2 === 0 ? "#a0703f" : "#6f4321"
          }
        />
        <BoardName />

        {introBoard.map((rowArray, row) =>
          rowArray.map((piece, column) => {
            if (!piece) return null;
            return (
              <PieceGeometry
                key={`intro-piece-${row}-${column}`}
                type={pieceType(piece)}
                color={pieceColor(piece)}
                position={[
                  -4 + column + 0.5,
                  0.04,
                  -4 + row + 0.5,
                ]}
                interactive={false}
              />
            );
          }),
        )}
      </group>
    </>
  );
}
