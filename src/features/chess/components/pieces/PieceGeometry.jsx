import { useThree } from "@react-three/fiber";
import { memo, useState } from "react";
import { PIECE_SCALE } from "../../constants";
import BishopMesh from "./BishopMesh";
import KnightMesh from "./KnightMesh";
import LathePiece from "./LathePiece";
import RookMesh from "./RookMesh";

const PieceGeometry = memo(function PieceGeometry({
  type,
  color,
  position,
  selected = false,
  legalTarget = false,
  interactive = true,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();

  const pieceColorHex = color === "w" ? "#f0d9b5" : "#6b3a2a";
  const emissive = selected
    ? "#ffaa00"
    : legalTarget
      ? "#44ff88"
      : hovered
        ? "#ffffff"
        : "#000000";
  const emissiveIntensity = selected ? 0.38 : legalTarget ? 0.26 : hovered ? 0.13 : 0;
  const scale = PIECE_SCALE[type] || 1.3;
  const knightRotationY = color === "w" ? Math.PI : 0;

  let geometry = null;
  if (type === "R") {
    geometry = (
      <RookMesh
        color={pieceColorHex}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    );
  } else if (type === "B") {
    geometry = (
      <BishopMesh
        color={pieceColorHex}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    );
  } else if (type === "N") {
    geometry = (
      <group rotation={[0, knightRotationY, 0]}>
        <KnightMesh
          color={pieceColorHex}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </group>
    );
  } else {
    geometry = (
      <LathePiece
        type={type}
        color={pieceColorHex}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    );
  }

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onPointerDown={
        interactive
          ? (event) => {
              event.stopPropagation();
            }
          : undefined
      }
      onClick={
        interactive && onClick
          ? (event) => {
              event.stopPropagation();
              onClick();
            }
          : undefined
      }
      onPointerEnter={
        interactive
          ? () => {
              setHovered(true);
              gl.domElement.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? () => {
              setHovered(false);
              gl.domElement.style.cursor = "default";
            }
          : undefined
      }
    >
      {geometry}
    </group>
  );
});

export default PieceGeometry;
