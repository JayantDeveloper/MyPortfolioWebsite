import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { CAMERA_VIEW } from "../constants";

export default function CameraRig({ playerColor }) {
  const { camera } = useThree();

  const targetPosition = useMemo(
    () =>
      playerColor === "w"
        ? new THREE.Vector3(CAMERA_VIEW.x, CAMERA_VIEW.y, CAMERA_VIEW.z)
        : new THREE.Vector3(CAMERA_VIEW.x, CAMERA_VIEW.y, -CAMERA_VIEW.z),
    [playerColor],
  );

  useEffect(() => {
    camera.position.copy(targetPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, targetPosition]);

  return null;
}
