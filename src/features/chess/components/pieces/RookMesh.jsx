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

export default function RookMesh({ color, emissive, emissiveIntensity }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.17, 0.2, 0.07, 18]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.135, 0.24, 18]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.135, 0.11, 0.22, 18]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh position={[0, 0.56, 0]} castShadow>
        <cylinderGeometry args={[0.175, 0.15, 0.065, 18]} />
        <PieceMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (Math.PI * index) / 4;
        return (
          <mesh
            key={index}
            position={[Math.sin(angle) * 0.14, 0.6425, Math.cos(angle) * 0.14]}
            castShadow
          >
            <boxGeometry args={[0.06, 0.065, 0.06]} />
            <PieceMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        );
      })}
    </group>
  );
}
