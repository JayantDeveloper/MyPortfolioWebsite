function PieceMaterial({ color, emissive, emissiveIntensity }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.38}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

export default function KnightMesh({ color, emissive, emissiveIntensity }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.19, 0.22, 0.07, 16]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.22, 0.04]} rotation={[-0.18, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 0.3, 14]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.46, 0.1]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.26, 0.21]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.34, 0.24]} rotation={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.11, 0.11, 0.18]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.57, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.14]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[-0.048, 0.67, 0.03]} rotation={[0, 0, 0.28]} castShadow>
        <boxGeometry args={[0.04, 0.11, 0.045]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0.048, 0.67, 0.03]} rotation={[0, 0, -0.28]} castShadow>
        <boxGeometry args={[0.04, 0.11, 0.045]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.58, -0.06]} castShadow>
        <boxGeometry args={[0.05, 0.18, 0.06]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}
