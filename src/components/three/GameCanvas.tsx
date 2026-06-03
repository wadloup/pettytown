import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useGameStore } from "../../game/store";
import CameraController from "./CameraController";
import Lighting from "./Lighting";
import TownScene from "./TownScene";

function GameCanvas() {
  const clearSelection = useGameStore((state) => state.clearSelection);

  return (
    <div className="game-canvas">
      <Canvas
        shadows
        orthographic
        camera={{ position: [9.5, 10.5, 8.4], zoom: 58, near: 0.1, far: 90 }}
        onPointerMissed={clearSelection}
      >
        <color attach="background" args={["#070A14"]} />
        <fog attach="fog" args={["#070A14", 13, 24]} />
        <Suspense fallback={null}>
          <Lighting />
          <CameraController />
          <TownScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default GameCanvas;
