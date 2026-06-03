function NeonLamp({ x, z, color = "#22D3EE" }: { x: number; z: number; color?: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.055, 0.08, 1.12, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.62} metalness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.16, 12, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} roughness={0.25} />
      </mesh>
      <pointLight position={[0, 1.16, 0]} color={color} intensity={1.3} distance={3.2} />
    </group>
  );
}

function NeonTree({ x, z, color = "#10B981" }: { x: number; z: number; color?: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 0.58, 6]} />
        <meshStandardMaterial color="#533525" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.78, 0]}>
        <coneGeometry args={[0.5, 0.86, 7]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} roughness={0.72} />
      </mesh>
    </group>
  );
}

function Bench({ x, z, rotation = 0 }: { x: number; z: number; rotation?: number }) {
  return (
    <group position={[x, 0.05, z]} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[1.05, 0.16, 0.24]} />
        <meshStandardMaterial color="#312E81" emissive="#7C3AED" emissiveIntensity={0.12} roughness={0.58} />
      </mesh>
      <mesh castShadow position={[0, 0.48, -0.16]}>
        <boxGeometry args={[1.05, 0.16, 0.16]} />
        <meshStandardMaterial color="#1E1B4B" roughness={0.62} />
      </mesh>
      <mesh castShadow position={[-0.42, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.28, 0.16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0.42, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.28, 0.16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.82} />
      </mesh>
    </group>
  );
}

function Ground() {
  const tilePositions = Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, column) => ({
      x: -6.4 + column * 1.6,
      z: -6.4 + row * 1.6,
      active: (row + column) % 2 === 0,
    })),
  ).flat();

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[17, 17]} />
        <meshStandardMaterial color="#0B0F1A" roughness={0.86} metalness={0.02} />
      </mesh>

      {tilePositions.map((tile) => (
        <mesh key={`${tile.x}_${tile.z}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[tile.x, -0.025, tile.z]}>
          <planeGeometry args={[1.46, 1.46]} />
          <meshStandardMaterial
            color={tile.active ? "#111827" : "#0F172A"}
            emissive={tile.active ? "#111827" : "#0B1022"}
            emissiveIntensity={0.1}
            roughness={0.9}
          />
        </mesh>
      ))}

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[13.6, 0.82]} />
        <meshStandardMaterial color="#1E1B4B" emissive="#7C3AED" emissiveIntensity={0.14} roughness={0.76} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.012, 0]}>
        <planeGeometry args={[13.6, 0.82]} />
        <meshStandardMaterial color="#123047" emissive="#22D3EE" emissiveIntensity={0.12} roughness={0.76} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[2.05, 2.16, 64]} />
        <meshBasicMaterial color="#D946EF" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.027, 0]}>
        <ringGeometry args={[0.88, 0.94, 64]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.45} />
      </mesh>

      <Bench x={-2.6} z={2.3} rotation={0.18} />
      <Bench x={2.55} z={-2.25} rotation={0.18} />
      <Bench x={-3.8} z={-2.55} rotation={-0.35} />
      <Bench x={4.05} z={2.55} rotation={-0.35} />

      <NeonLamp x={-3.2} z={1.4} color="#D946EF" />
      <NeonLamp x={3.2} z={-1.4} color="#22D3EE" />
      <NeonLamp x={-1.4} z={-3.2} color="#7C3AED" />
      <NeonLamp x={1.4} z={3.2} color="#3B82F6" />

      <NeonTree x={-6.6} z={-5.6} color="#10B981" />
      <NeonTree x={-6.0} z={5.8} color="#34D399" />
      <NeonTree x={5.8} z={-5.9} color="#22D3EE" />
      <NeonTree x={6.3} z={5.15} color="#A78BFA" />
      <NeonTree x={-3.6} z={-6.45} color="#10B981" />
      <NeonTree x={3.1} z={6.55} color="#7C3AED" />
    </group>
  );
}

export default Ground;
