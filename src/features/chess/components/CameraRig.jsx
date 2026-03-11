import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import useResponsive from "../../../hooks/useResponsive";
import { CAMERA_VIEW } from "../constants";

export default function CameraRig({ playerColor }) {
  const { camera } = useThree();
  const { isMobile } = useResponsive();
  const mobileY = CAMERA_VIEW.y + 1.2;
  const mobileZ = CAMERA_VIEW.z + 1.4;
  const mobileScale = 20 / Math.hypot(mobileY, mobileZ);

  const targetPosition = useMemo(
    () =>
      playerColor === "w"
        ? new THREE.Vector3(
            CAMERA_VIEW.x,
            isMobile ? mobileY * mobileScale : CAMERA_VIEW.y,
            isMobile ? mobileZ * mobileScale : CAMERA_VIEW.z,
          )
        : new THREE.Vector3(
            CAMERA_VIEW.x,
            isMobile ? mobileY * mobileScale : CAMERA_VIEW.y,
            -(isMobile ? mobileZ * mobileScale : CAMERA_VIEW.z),
          ),
    [isMobile, mobileScale, mobileY, mobileZ, playerColor],
  );

  useEffect(() => {
    camera.position.copy(targetPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, targetPosition]);

  return null;
}
