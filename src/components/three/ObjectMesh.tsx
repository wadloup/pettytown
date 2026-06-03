import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { WorldObject } from "../../game/types";

const objectColor: Record<WorldObject["type"], string> = {
  red_box: "#ef4444",
  golden_chair: "#facc15",
  lost_phone: "#22D3EE",
  mystery_letter: "#f8fafc",
  fake_trophy: "#f59e0b",
  sign: "#38bdf8",
};

function ObjectMesh({ object }: { object: WorldObject }) {
  const groupRef = useRef<Group>(null);
  const pulseRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
    }
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2.2 + object.importance) * 0.08;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[object.position.x, 0, object.position.z]}>
      <group ref={pulseRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <ringGeometry args={[0.48, 0.62, 36]} />
          <meshBasicMaterial color={objectColor[object.type]} transparent opacity={0.58} />
        </mesh>
        <pointLight position={[0, 0.65, 0]} color={objectColor[object.type]} intensity={0.9} distance={2.4} />
      </group>
      <group ref={groupRef}>
        {object.type === "golden_chair" ? (
          <group>
            <mesh castShadow position={[0, 0.32, 0]}>
              <boxGeometry args={[0.52, 0.12, 0.48]} />
              <meshStandardMaterial color={objectColor[object.type]} emissive={objectColor[object.type]} emissiveIntensity={0.32} metalness={0.22} roughness={0.45} />
            </mesh>
            <mesh castShadow position={[0, 0.66, -0.22]}>
              <boxGeometry args={[0.52, 0.58, 0.1]} />
              <meshStandardMaterial color={objectColor[object.type]} emissive={objectColor[object.type]} emissiveIntensity={0.28} metalness={0.22} roughness={0.45} />
            </mesh>
          </group>
        ) : object.type === "sign" ? (
          <group>
            <mesh castShadow position={[0, 0.42, 0]}>
              <boxGeometry args={[0.12, 0.84, 0.12]} />
              <meshStandardMaterial color="#7c5c39" />
            </mesh>
            <mesh castShadow position={[0, 0.88, 0]}>
              <boxGeometry args={[0.72, 0.34, 0.08]} />
              <meshStandardMaterial color={objectColor[object.type]} emissive={objectColor[object.type]} emissiveIntensity={0.45} />
            </mesh>
          </group>
        ) : object.type === "fake_trophy" ? (
          <group>
            <mesh castShadow position={[0, 0.26, 0]}>
              <cylinderGeometry args={[0.18, 0.26, 0.18, 8]} />
              <meshStandardMaterial color="#6b4f2a" />
            </mesh>
            <mesh castShadow position={[0, 0.62, 0]}>
              <coneGeometry args={[0.32, 0.55, 8]} />
              <meshStandardMaterial color={objectColor[object.type]} emissive={objectColor[object.type]} emissiveIntensity={0.35} metalness={0.18} roughness={0.42} />
            </mesh>
          </group>
        ) : (
          <mesh castShadow position={[0, 0.38, 0]}>
            <boxGeometry args={object.type === "lost_phone" ? [0.38, 0.08, 0.62] : [0.55, 0.55, 0.55]} />
            <meshStandardMaterial color={objectColor[object.type]} emissive={objectColor[object.type]} emissiveIntensity={0.28} roughness={0.64} />
          </mesh>
        )}
      </group>
      <Text
        position={[0, 1.16, 0]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.18}
        color="#F5F7FF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#0B0F1A"
      >
        {object.name}
      </Text>
    </group>
  );
}

export default ObjectMesh;
