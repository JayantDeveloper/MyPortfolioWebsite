import { squareCenter } from "../constants";
import PieceGeometry from "./pieces/PieceGeometry";

const PROMOTION_OPTIONS = ["Q", "R", "B", "N"];

function PromotionBase({ position, onClick }) {
  return (
    <mesh
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <cylinderGeometry args={[0.34, 0.34, 0.08, 18]} />
      <meshStandardMaterial
        color="#1d1522"
        roughness={0.45}
        metalness={0.18}
        emissive="#6d5fa1"
        emissiveIntensity={0.32}
      />
    </mesh>
  );
}

export default function PromotionPicker({ pendingPromotion, onSelect }) {
  if (!pendingPromotion) return null;

  const [row, column] = pendingPromotion.to;
  const direction = column <= 3 ? 1 : -1;
  const anchorX = squareCenter(column) + direction * 0.92;
  const anchorZ = squareCenter(row);
  const color = pendingPromotion.color;

  return (
    <group position={[anchorX, 0.16, anchorZ]}>
      {PROMOTION_OPTIONS.map((option, index) => {
        const offsetZ = (index - 1.5) * 0.78;
        return (
          <group key={option}>
            <PromotionBase position={[0, 0, offsetZ]} onClick={() => onSelect(option)} />
            <group position={[0, 0.05, offsetZ]} scale={[0.44, 0.44, 0.44]}>
              <PieceGeometry
                type={option}
                color={color}
                position={[0, 0, 0]}
                interactive
                onClick={() => onSelect(option)}
              />
            </group>
          </group>
        );
      })}
    </group>
  );
}
