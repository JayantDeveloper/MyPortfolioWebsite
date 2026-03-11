import { memo } from "react";

const MoveDot = memo(function MoveDot({
  position,
  onClick,
  color = "#44ff88",
  emissive = color,
  opacity = 0.72,
}) {
  return (
    <mesh
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <cylinderGeometry args={[0.2, 0.2, 0.055, 20]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={emissive}
        emissiveIntensity={0.55}
      />
    </mesh>
  );
});

export default MoveDot;
