import { useMemo } from "react";
import * as THREE from "three";
import { LATHE, LATHE_RADIUS } from "../../constants";

export default function LathePiece({
  type,
  color,
  emissive,
  emissiveIntensity,
  radialSegments = 24,
}) {
  const points = useMemo(() => {
    const profile = LATHE[type] || LATHE.P;
    const radiusScale = LATHE_RADIUS[type] || LATHE_RADIUS.P;
    return profile.map(
      ([x, y]) => new THREE.Vector2(x * radiusScale, y * radiusScale),
    );
  }, [type]);

  const materialProps = {
    color,
    roughness: 0.33,
    metalness: 0.07,
    emissive,
    emissiveIntensity,
  };

  return (
    <group>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, radialSegments]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {type === "K" && (
        <group position={[0, 0.68, 0]}>
          <mesh>
            <boxGeometry args={[0.07, 0.25, 0.04]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.07, 0.17, 0.04]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>
      )}

      {type === "Q" && (
        <group position={[0, 0.74, 0]}>
          {[
            0,
            (Math.PI * 2) / 5,
            (Math.PI * 4) / 5,
            (Math.PI * 6) / 5,
            (Math.PI * 8) / 5,
          ].map((angle, index) => (
            <mesh
              key={index}
              position={[Math.sin(angle) * 0.065, 0.04, Math.cos(angle) * 0.065]}
              castShadow
            >
              <sphereGeometry args={[0.038, 8, 8]} />
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.1}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
