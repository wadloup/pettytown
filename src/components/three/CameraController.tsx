import { OrbitControls } from "@react-three/drei";

function CameraController() {
  return (
    <OrbitControls
      enableRotate={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minZoom={38}
      maxZoom={82}
      target={[0, 0, 0]}
    />
  );
}

export default CameraController;
