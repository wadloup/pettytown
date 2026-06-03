import type { Location } from "../../game/types";

type BuildingMeshProps = {
  location: Location;
};

const signColor: Record<Location["type"], string> = {
  cafe: "#D946EF",
  park: "#10B981",
  shop: "#22D3EE",
  town_square: "#A78BFA",
  office: "#3B82F6",
  home: "#A855F7",
};

function NeonWindow({ x, y, z, color }: { x: number; y: number; z: number; color: string }) {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[0.38, 0.34, 0.035]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} roughness={0.28} />
    </mesh>
  );
}

function Sign({ y, color }: { y: number; color: string }) {
  return (
    <group position={[0, y, 0.03]}>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.52, 0.24, 0.06]} />
        <meshStandardMaterial color="#020617" emissive={color} emissiveIntensity={0.52} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.28, 0.06, 0.035]} />
        <meshBasicMaterial color={color} transparent opacity={0.86} />
      </mesh>
    </group>
  );
}

function BuildingMesh({ location }: BuildingMeshProps) {
  const darkened = location.effect === "power_outage";
  const color = darkened ? "#111827" : location.color;
  const glow = darkened ? "#334155" : signColor[location.type];

  if (location.type === "town_square") {
    return (
      <group>
        <mesh castShadow receiveShadow position={[0, 0.09, 0]}>
          <cylinderGeometry args={[1.45, 1.68, 0.18, 8]} />
          <meshStandardMaterial color="#27145F" emissive="#7C3AED" emissiveIntensity={0.16} roughness={0.58} />
        </mesh>
        <mesh castShadow position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.95, 8]} />
          <meshStandardMaterial color="#C4B5FD" emissive="#7C3AED" emissiveIntensity={0.2} roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 1.22, 0]}>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial color="#F0ABFC" emissive="#D946EF" emissiveIntensity={1.45} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 1.25, 0]} color="#D946EF" intensity={1.4} distance={3.5} />
      </group>
    );
  }

  if (location.type === "park") {
    return (
      <group>
        <mesh receiveShadow position={[0, 0.04, 0]}>
          <boxGeometry args={[location.size.width, 0.08, location.size.depth]} />
          <meshStandardMaterial color="#064E3B" emissive="#10B981" emissiveIntensity={0.16} roughness={0.82} />
        </mesh>
        {[-1.2, 0, 1.2].map((x) => (
          <group key={x} position={[x, 0, Math.sin(x) * 0.45]}>
            <mesh castShadow position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 0.56, 6]} />
              <meshStandardMaterial color="#533525" />
            </mesh>
            <mesh castShadow position={[0, 0.78, 0]}>
              <dodecahedronGeometry args={[0.42, 0]} />
              <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.24} roughness={0.65} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.55, 1.62, 32]} />
          <meshBasicMaterial color="#34D399" transparent opacity={0.34} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, location.size.height / 2, 0]}>
        <boxGeometry args={[location.size.width, location.size.height, location.size.depth]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={darkened ? 0.02 : 0.08} roughness={0.62} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0, location.size.height + 0.34, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[Math.max(location.size.width, location.size.depth) * 0.78, 0.72, 4]} />
        <meshStandardMaterial color="#111827" emissive={glow} emissiveIntensity={darkened ? 0.05 : 0.26} roughness={0.56} />
      </mesh>

      <Sign y={location.size.height * 0.95} color={glow} />

      <NeonWindow x={-0.76} y={location.size.height * 0.6} z={location.size.depth / 2 + 0.012} color={glow} />
      <NeonWindow x={0.0} y={location.size.height * 0.6} z={location.size.depth / 2 + 0.012} color={glow} />
      <NeonWindow x={0.76} y={location.size.height * 0.6} z={location.size.depth / 2 + 0.012} color={glow} />

      <mesh position={[0, location.size.height * 0.25, location.size.depth / 2 + 0.018]}>
        <boxGeometry args={[0.52, 0.58, 0.04]} />
        <meshStandardMaterial color="#020617" emissive={darkened ? "#020617" : "#22D3EE"} emissiveIntensity={darkened ? 0.02 : 0.18} roughness={0.28} />
      </mesh>

      <mesh position={[location.size.width / 2 + 0.02, location.size.height * 0.52, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.95, 0.22, 0.04]} />
        <meshStandardMaterial color="#020617" emissive={glow} emissiveIntensity={darkened ? 0.04 : 0.5} roughness={0.36} />
      </mesh>
    </group>
  );
}

export default BuildingMesh;
