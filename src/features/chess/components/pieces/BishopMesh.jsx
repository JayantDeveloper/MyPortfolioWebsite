import * as THREE from "three";

function PieceMaterial({ color, emissive, emissiveIntensity }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.32}
      metalness={0.08}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

export default function BishopMesh({ color, emissive, emissiveIntensity }) {
  const bodyPoints = [
    [0, 0],
    [0.2, 0],
    [0.2, 0.06],
    [0.14, 0.12],
    [0.08, 0.24],
    [0.1, 0.36],
    [0.09, 0.48],
    [0.11, 0.54],
    [0.13, 0.6],
    [0.12, 0.66],
    [0.1, 0.72],
    [0.09, 0.78],
    [0.085, 0.84],
    [0.075, 0.9],
    [0.055, 0.96],
    [0.03, 1.01],
    [0, 1.01],
  ].map(([x, y]) => new THREE.Vector2(x * 0.66, y * 0.66));

  return (
    <group>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[bodyPoints, 24]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.37, 0]} castShadow>
        <torusGeometry args={[0.068, 0.016, 10, 24]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.42]} castShadow>
        <boxGeometry args={[0.16, 0.02, 0.02]} />
        <meshStandardMaterial
          color={color === "#f0d9b5" ? "#c8a87a" : "#3e1e0e"}
          roughness={0.5}
        />
      </mesh>

      <mesh position={[0, 0.692, 0]} castShadow>
        <sphereGeometry args={[0.033, 12, 12]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}
