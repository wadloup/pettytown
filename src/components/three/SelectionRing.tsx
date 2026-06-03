import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function SelectionRing({ color = "#111827" }: { color?: string }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[0.48, 0.61, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.86} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <ringGeometry args={[0.72, 0.75, 48]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.42} />
      </mesh>
      <pointLight position={[0, 0.55, 0]} color={color} intensity={1.1} distance={2.4} />
    </group>
  );
}

export default SelectionRing;
