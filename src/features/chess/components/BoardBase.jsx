import {
  BOARD_FRAME_COLOR,
  BOARD_TOTAL,
  FRAME_H,
  N_SQ,
  SQ,
  squareCenter,
} from "../constants";

export default function BoardBase({ getSquareColor, interactive = false, onSquareClick }) {
  return (
    <>
      <mesh position={[0, -FRAME_H / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[BOARD_TOTAL, FRAME_H, BOARD_TOTAL]} />
        <meshStandardMaterial
          color={BOARD_FRAME_COLOR}
          roughness={0.9}
          metalness={0.01}
        />
      </mesh>

      {Array.from({ length: N_SQ }).map((_, row) =>
        Array.from({ length: N_SQ }).map((_, column) => (
          <mesh
            key={`sq-${row}-${column}`}
            position={[squareCenter(column), 0.001, squareCenter(row)]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            onClick={
              interactive && onSquareClick
                ? (event) => {
                    event.stopPropagation();
                    onSquareClick(row, column);
                  }
                : undefined
            }
          >
            <planeGeometry args={[SQ, SQ]} />
            <meshStandardMaterial
              color={getSquareColor(row, column)}
              roughness={0.88}
              metalness={0.02}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </mesh>
        )),
      )}
    </>
  );
}
