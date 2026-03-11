import { memo } from "react";

const MoveDot = memo(function MoveDot({ position, onClick }) {
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
        color="#44ff88"
        transparent
        opacity={0.72}
        emissive="#44ff88"
        emissiveIntensity={0.55}
      />
    </mesh>
  );
});

export default MoveDot;
