import { Html, Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useGameStore } from "../../../game/store";
import { canTargetLocation, canTargetNpc, isNpcInDrama } from "../../../game/targeting";
import type { Location } from "../../../game/types";
import EffectMesh from "../EffectMesh";
import NPCMesh from "../NPCMesh";
import ObjectMesh from "../ObjectMesh";

function CafeTable({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.12, 10]} />
        <meshStandardMaterial color="#2E1065" emissive="#7C3AED" emissiveIntensity={0.22} roughness={0.48} />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.42, 8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.68} />
      </mesh>
      {[
        [0.72, 0, 0],
        [-0.72, 0, Math.PI],
        [0, 0.72, Math.PI / 2],
      ].map(([chairX, chairZ, rotation], index) => (
        <mesh key={index} castShadow position={[chairX, 0.26, chairZ]} rotation={[0, rotation, 0]}>
          <boxGeometry args={[0.34, 0.34, 0.34]} />
          <meshStandardMaterial color="#111827" emissive="#D946EF" emissiveIntensity={0.14} roughness={0.58} />
        </mesh>
      ))}
    </group>
  );
}

function CafeLamp({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.045, 0.07, 1.4, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.16, 12, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} roughness={0.28} />
      </mesh>
      <pointLight position={[0, 1.3, 0]} color={color} intensity={1.35} distance={3.2} />
    </group>
  );
}

function CafeLocationTarget({ location }: { location: Location }) {
  const [hovered, setHovered] = useState(false);
  const targetable = canTargetLocation(useGameStore.getState(), location.id);
  const selectLocation = useGameStore((state) => state.selectLocation);
  const setHoveredTarget = useGameStore((state) => state.setHoveredTarget);

  useEffect(() => {
    if (!targetable && hovered) {
      setHovered(false);
      setHoveredTarget(undefined);
      document.body.style.cursor = "";
    }
  }, [hovered, setHoveredTarget, targetable]);

  const pointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (!targetable) return;
    event.stopPropagation();
    setHovered(true);
    setHoveredTarget(`location:${location.id}`);
    document.body.style.cursor = "pointer";
  };

  const pointerOut = () => {
    if (!hovered) return;
    setHovered(false);
    setHoveredTarget(undefined);
    document.body.style.cursor = "";
  };

  const click = (event: ThreeEvent<MouseEvent>) => {
    if (!targetable) return;
    event.stopPropagation();
    selectLocation(location.id);
  };

  return (
    <group onClick={targetable ? click : undefined} onPointerOver={targetable ? pointerOver : undefined} onPointerOut={targetable ? pointerOut : undefined}>
      {targetable ? (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.8, 4.2]} />
          <meshBasicMaterial transparent opacity={0.002} depthWrite={false} />
        </mesh>
      ) : null}
      {(targetable || hovered) && (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.25, 2.45, 64]} />
          <meshBasicMaterial color="#D946EF" transparent opacity={0.48} />
        </mesh>
      )}
      {hovered ? (
        <Html position={[0, 1.5, 0]} center>
          <div className="world-tooltip">
            <strong>{location.name}</strong>
            <span>Cliquer pour cibler ce lieu</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function InteriorCafeScene() {
  const npcs = useGameStore((state) => state.npcs.filter((npc) => npc.zoneId === state.currentZoneId));
  const location = useGameStore((state) => state.locations.find((candidate) => candidate.zoneId === state.currentZoneId));
  const objects = useGameStore((state) => state.objects.filter((object) => object.zoneId === state.currentZoneId));
  const effects = useGameStore((state) => state.effects);
  const selectedNpcId = useGameStore((state) => state.selectedNpcId);
  const selectNpc = useGameStore((state) => state.selectNpc);
  const setHoveredTarget = useGameStore((state) => state.setHoveredTarget);
  const interaction = useGameStore((state) => state.interaction);

  if (!location) return null;

  return (
    <group>
      <mesh receiveShadow position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.5, 6.6]} />
        <meshStandardMaterial color="#090B16" emissive="#140A2D" emissiveIntensity={0.18} roughness={0.78} />
      </mesh>
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.2, 4.8]} />
        <meshStandardMaterial color="#111827" emissive="#7C3AED" emissiveIntensity={0.1} roughness={0.82} />
      </mesh>

      <mesh castShadow position={[0, 1.1, -2.45]}>
        <boxGeometry args={[6.8, 2.2, 0.2]} />
        <meshStandardMaterial color="#120A2A" emissive="#7C3AED" emissiveIntensity={0.12} roughness={0.64} />
      </mesh>
      <mesh castShadow position={[-3.35, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4.9, 1.8, 0.18]} />
        <meshStandardMaterial color="#0F172A" emissive="#22D3EE" emissiveIntensity={0.06} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[3.35, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4.9, 1.8, 0.18]} />
        <meshStandardMaterial color="#0F172A" emissive="#D946EF" emissiveIntensity={0.06} roughness={0.7} />
      </mesh>

      <mesh castShadow position={[0, 0.52, -1.65]}>
        <boxGeometry args={[3.8, 0.72, 0.64]} />
        <meshStandardMaterial color="#2E1065" emissive="#D946EF" emissiveIntensity={0.18} roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.96, -1.28]}>
        <boxGeometry args={[3.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.1} roughness={0.24} />
      </mesh>

      <Text position={[0, 2.15, -2.32]} fontSize={0.42} color="#F5F7FF" anchorX="center" outlineWidth={0.02} outlineColor="#0B0F1A">
        Cafe des Soupirs
      </Text>
      <pointLight position={[0, 2.1, -1.8]} color="#D946EF" intensity={2.2} distance={6} />
      <ambientLight intensity={0.25} />

      <CafeTable x={-1.65} z={0.8} />
      <CafeTable x={1.55} z={0.72} />
      <CafeTable x={0.2} z={2.05} />
      <CafeLamp x={-2.65} z={-1.35} color="#D946EF" />
      <CafeLamp x={2.65} z={-1.2} color="#22D3EE" />

      <CafeLocationTarget location={location} />

      {objects.map((object) => (
        <ObjectMesh key={object.id} object={object} />
      ))}

      {effects.map((effect) => {
        const target =
          effect.targetType === "npc"
            ? npcs.find((npc) => npc.id === effect.targetId)
            : effect.targetId === location.id
              ? location
              : undefined;
        return target ? <EffectMesh key={effect.id} effect={effect} position={target.position} /> : null;
      })}

      {npcs.map((npc) => {
        const targetable = canTargetNpc(useGameStore.getState(), npc.id);
        const clickable = interaction.mode === "idle" || targetable;

        return (
          <NPCMesh
            key={npc.id}
            npc={npc}
            selected={npc.id === selectedNpcId || interaction.firstSelectedNpcId === npc.id}
            targetable={targetable}
            clickable={clickable}
            involvedInDrama={isNpcInDrama(useGameStore.getState(), npc.id)}
            onSelect={selectNpc}
            onHover={(hovered) => setHoveredTarget(hovered ? `npc:${npc.id}` : undefined)}
          />
        );
      })}
    </group>
  );
}

export default InteriorCafeScene;
