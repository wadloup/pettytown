import { Html, Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { getNpcVisualProfile } from "../../data/npcVisuals";
import type { NPC, NPCVisual } from "../../game/types";
import SelectionRing from "./SelectionRing";
import StatusBillboard from "./StatusBillboard";

type NPCMeshProps = {
  npc: NPC;
  selected: boolean;
  targetable: boolean;
  clickable: boolean;
  involvedInDrama: boolean;
  onSelect: (npcId: string) => void;
  onHover: (hovered: boolean) => void;
};

function HairMesh({ visual }: { visual: NPCVisual }) {
  const color = visual.secondary;

  if (visual.hairStyle === "none") return null;

  if (visual.hairStyle === "cap") {
    return (
      <group>
        <mesh castShadow position={[0, 1.28, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.12, 8]} />
          <meshStandardMaterial color={color} roughness={0.54} />
        </mesh>
        <mesh castShadow position={[0, 1.26, 0.22]}>
          <boxGeometry args={[0.34, 0.06, 0.22]} />
          <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.28} />
        </mesh>
      </group>
    );
  }

  if (visual.hairStyle === "hood") {
    return (
      <mesh castShadow position={[0, 1.18, -0.03]}>
        <coneGeometry args={[0.42, 0.52, 7]} />
        <meshStandardMaterial color={color} emissive={visual.primary} emissiveIntensity={0.1} roughness={0.62} />
      </mesh>
    );
  }

  if (visual.hairStyle === "spikes" || visual.hairStyle === "mohawk") {
    const count = visual.hairStyle === "mohawk" ? 4 : 5;
    return (
      <group>
        {Array.from({ length: count }, (_, index) => (
          <mesh key={index} castShadow position={[(index - (count - 1) / 2) * 0.09, 1.35 + index * 0.006, visual.hairStyle === "mohawk" ? 0 : -0.02]}>
            <coneGeometry args={[0.095, visual.hairStyle === "mohawk" ? 0.34 : 0.24, 5]} />
            <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.34} roughness={0.5} />
          </mesh>
        ))}
      </group>
    );
  }

  if (visual.hairStyle === "bun") {
    return (
      <group>
        <mesh castShadow position={[0, 1.29, -0.04]}>
          <sphereGeometry args={[0.29, 10, 8]} />
          <meshStandardMaterial color={color} roughness={0.58} />
        </mesh>
        <mesh castShadow position={[0, 1.43, -0.24]}>
          <sphereGeometry args={[0.16, 8, 6]} />
          <meshStandardMaterial color={color} roughness={0.58} />
        </mesh>
      </group>
    );
  }

  if (visual.hairStyle === "halo") {
    return (
      <mesh position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.29, 0.035, 8, 24]} />
        <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.85} roughness={0.32} />
      </mesh>
    );
  }

  if (visual.hairStyle === "sidecut") {
    return (
      <group>
        <mesh castShadow position={[-0.12, 1.24, -0.04]}>
          <boxGeometry args={[0.28, 0.26, 0.36]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
        <mesh castShadow position={[0.18, 1.31, -0.02]}>
          <boxGeometry args={[0.18, 0.16, 0.32]} />
          <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.28} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh castShadow position={[0, 1.26, -0.03]}>
      <sphereGeometry args={[0.32, 10, 8]} />
      <meshStandardMaterial color={color} roughness={0.56} />
    </mesh>
  );
}

function AccessoryMesh({ visual }: { visual: NPCVisual }) {
  if (visual.accessory === "none") return null;

  if (visual.accessory === "glasses" || visual.accessory === "visor") {
    return (
      <group position={[0, 1.12, 0.25]}>
        <mesh>
          <boxGeometry args={[0.42, 0.08, 0.035]} />
          <meshStandardMaterial color={visual.accessory === "visor" ? visual.accent : "#020617"} emissive={visual.accent} emissiveIntensity={0.55} />
        </mesh>
      </group>
    );
  }

  if (visual.accessory === "bag") {
    return (
      <mesh castShadow position={[0.34, 0.58, -0.08]} rotation={[0.1, 0, -0.15]}>
        <boxGeometry args={[0.2, 0.42, 0.26]} />
        <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.18} roughness={0.62} />
      </mesh>
    );
  }

  if (visual.accessory === "scarf" || visual.accessory === "collar") {
    return (
      <mesh castShadow position={[0, 0.88, 0.03]}>
        <boxGeometry args={[0.52, 0.12, 0.34]} />
        <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.35} roughness={0.42} />
      </mesh>
    );
  }

  if (visual.accessory === "headset") {
    return (
      <group>
        <mesh position={[0, 1.15, 0]}>
          <torusGeometry args={[0.34, 0.022, 6, 20, Math.PI]} />
          <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.58} />
        </mesh>
        <mesh position={[0.26, 1.08, 0.08]}>
          <boxGeometry args={[0.08, 0.14, 0.12]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>
    );
  }

  return (
    <mesh position={[0.26, 1.1, 0.14]}>
      <sphereGeometry args={[0.045, 8, 6]} />
      <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.8} />
    </mesh>
  );
}

function TorsoMesh({ visual }: { visual: NPCVisual }) {
  const size: Record<NPCVisual["bodyShape"], [number, number, number]> = {
    boxy: [0.58, 0.58, 0.42],
    longcoat: [0.56, 0.78, 0.42],
    hoodie: [0.62, 0.62, 0.46],
    sharp: [0.5, 0.62, 0.38],
    wide: [0.72, 0.58, 0.46],
    street: [0.56, 0.64, 0.42],
  };

  const [width, height, depth] = size[visual.bodyShape];

  return (
    <group>
      <mesh castShadow position={[0, 0.64, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={visual.primary} emissive={visual.primary} emissiveIntensity={0.2} roughness={0.54} />
      </mesh>
      <mesh castShadow position={[0, 0.68, depth / 2 + 0.012]}>
        <boxGeometry args={[width * 0.7, height * 0.14, 0.035]} />
        <meshStandardMaterial color={visual.accent} emissive={visual.accent} emissiveIntensity={0.75} roughness={0.28} />
      </mesh>
      {visual.bodyShape === "longcoat" || visual.bodyShape === "street" ? (
        <mesh castShadow position={[0, 0.37, depth / 2 + 0.016]}>
          <boxGeometry args={[width * 0.86, 0.2, 0.04]} />
          <meshStandardMaterial color={visual.secondary} roughness={0.56} />
        </mesh>
      ) : null}
    </group>
  );
}

function NPCMesh({ npc, selected, targetable, clickable, involvedInDrama, onSelect, onHover }: NPCMeshProps) {
  const [hovered, setHovered] = useState(false);
  const visual = npc.visual ?? getNpcVisualProfile(Number(npc.id.replace("npc_", "")) || 0, npc.personality);
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const target = useMemo(() => new Vector3(npc.position.x, npc.position.y, npc.position.z), [npc.position.x, npc.position.y, npc.position.z]);

  useEffect(() => {
    if (!clickable && hovered) {
      setHovered(false);
      onHover(false);
      document.body.style.cursor = "";
    }
  }, [clickable, hovered, onHover]);

  useFrame((state, delta) => {
    const isMoving = Math.hypot(npc.targetPosition.x - npc.position.x, npc.targetPosition.z - npc.position.z) > 0.28;

    if (groupRef.current) {
      groupRef.current.position.lerp(target, Math.min(1, delta * 6));
      groupRef.current.rotation.y += (npc.rotationY - groupRef.current.rotation.y) * Math.min(1, delta * 8);
    }
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 4.3 + npc.id.length) * (isMoving ? 0.04 : 0.018);
      bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.2 + npc.id.length) * (isMoving ? 0.06 : 0.025);
    }
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 6.2) * (isMoving ? 0.42 : 0.08);
      rightLegRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 6.2 + Math.PI) * (isMoving ? 0.42 : 0.08);
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!clickable) return;
    event.stopPropagation();
    onSelect(npc.id);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (!clickable) return;
    event.stopPropagation();
    setHovered(true);
    onHover(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    if (!hovered) return;
    setHovered(false);
    onHover(false);
    document.body.style.cursor = "";
  };

  const showHover = hovered && clickable;

  return (
    <group
      ref={groupRef}
      position={[npc.position.x, 0, npc.position.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {selected || showHover || targetable ? <SelectionRing color={selected ? visual.accent : targetable ? "#D946EF" : visual.primary} /> : null}
      {involvedInDrama ? (
        <mesh position={[0, 1.86, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color="#FB7185" emissive="#FB7185" emissiveIntensity={1.2} />
        </mesh>
      ) : null}

      <group ref={bodyRef}>
        <TorsoMesh visual={visual} />

        <group ref={leftLegRef} position={[-0.16, 0.28, 0.02]}>
          <mesh castShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[0.16, 0.42, 0.18]} />
            <meshStandardMaterial color={visual.secondary} roughness={0.68} />
          </mesh>
        </group>
        <group ref={rightLegRef} position={[0.16, 0.28, 0.02]}>
          <mesh castShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[0.16, 0.42, 0.18]} />
            <meshStandardMaterial color={visual.secondary} roughness={0.68} />
          </mesh>
        </group>

        <mesh castShadow position={[-0.42, 0.64, 0]} rotation={[0.08, 0, 0.14]}>
          <boxGeometry args={[0.14, 0.48, 0.14]} />
          <meshStandardMaterial color={visual.primary} roughness={0.62} />
        </mesh>
        <mesh castShadow position={[0.42, 0.64, 0]} rotation={[0.08, 0, -0.14]}>
          <boxGeometry args={[0.14, 0.48, 0.14]} />
          <meshStandardMaterial color={visual.primary} roughness={0.62} />
        </mesh>

        <mesh castShadow position={[0, 1.08, 0]}>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color={visual.skin} roughness={0.55} />
        </mesh>
        <mesh position={[-0.09, 1.12, 0.26]}>
          <boxGeometry args={[0.045, 0.035, 0.02]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
        <mesh position={[0.09, 1.12, 0.26]}>
          <boxGeometry args={[0.045, 0.035, 0.02]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        <HairMesh visual={visual} />
        <AccessoryMesh visual={visual} />
      </group>

      <StatusBillboard icons={npc.statusIcons} />

      {(selected || showHover || targetable) && (
        <Text
          position={[0, 1.98, 0]}
          rotation={[-Math.PI / 4, 0, 0]}
          fontSize={0.16}
          color="#F5F7FF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#0B0F1A"
        >
          {visual.title}
        </Text>
      )}

      {showHover ? (
        <Html position={[0, 2.24, 0]} center>
          <div className="world-tooltip npc-tooltip">
            <strong>{npc.name}</strong>
            <span>{visual.title}</span>
            <small>
              Stress {Math.round(npc.stats.stress)} - {npc.currentAction}
            </small>
          </div>
        </Html>
      ) : null}

      <Text
        position={[0, 1.46, 0]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.19}
        color="#F5F7FF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.014}
        outlineColor="#0B0F1A"
      >
        {npc.name}
      </Text>
    </group>
  );
}

export default NPCMesh;
