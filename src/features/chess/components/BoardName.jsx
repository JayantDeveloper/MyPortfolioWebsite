import { Center, Text3D } from "@react-three/drei";
import {
  BOARD_NAME_LINES,
  BOARD_TEXT_MATERIAL,
  BOARD_TEXT_PROPS,
} from "../constants";

function EngravedLine({ text, position }) {
  return (
    <group position={position}>
      <Center>
        <Text3D {...BOARD_TEXT_PROPS}>
          {text}
          <meshStandardMaterial {...BOARD_TEXT_MATERIAL} />
        </Text3D>
      </Center>
    </group>
  );
}

export default function BoardName({ rotationY = 0 }) {
  return (
    <group position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, rotationY]}>
      <EngravedLine text={BOARD_NAME_LINES[0]} position={[0, 0.34, 0]} />
      <EngravedLine text={BOARD_NAME_LINES[1]} position={[0, -0.34, 0]} />
    </group>
  );
}
