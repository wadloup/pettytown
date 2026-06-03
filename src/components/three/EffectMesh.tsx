import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { Vector3Data, VisualEffect } from "../../game/types";

type EffectMeshProps = {
  effect: VisualEffect;
  position: Vector3Data;
};

function EffectMesh({ effect, position }: EffectMeshProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.12;
    groupRef.current.scale.setScalar(pulse);
    groupRef.current.rotation.y += 0.025;
  });

  return (
    <group ref={groupRef} position={[position.x, 0.08, position.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 1.12, 52]} />
        <meshBasicMaterial color={effect.color} transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.28, 1.34, 52]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.28} />
      </mesh>
      <pointLight position={[0, 0.85, 0]} color={effect.color} intensity={1.6} distance={3.4} />
      <Text
        position={[0, 1.12, 0]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.18}
        color="#F5F7FF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#0B0F1A"
      >
        {effect.label}
      </Text>
    </group>
  );
}

export default EffectMesh;
