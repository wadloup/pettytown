import { Html, Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import type { Location } from "../../game/types";
import BuildingMesh from "./BuildingMesh";

type LocationMeshProps = {
  location: Location;
  selected: boolean;
  targetable: boolean;
  clickable: boolean;
  tooltipText?: string;
  interactionActive: boolean;
  onSelect: (locationId: string) => void;
  onHover: (hovered: boolean) => void;
};

function LocationMesh({ location, selected, targetable, clickable, tooltipText, interactionActive, onSelect, onHover }: LocationMeshProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!clickable && hovered) {
      setHovered(false);
      onHover(false);
      document.body.style.cursor = "";
    }
  }, [clickable, hovered, onHover]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!clickable) return;
    onSelect(location.id);
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

  const pulseColor =
    location.effect === "party" ? "#f97316" : location.effect === "power_outage" ? "#475569" : location.effect ? "#ef4444" : "#ffffff";

  return (
    <group
      position={[location.position.x, 0, location.position.z]}
      onClick={clickable ? handleClick : undefined}
      onPointerOver={clickable ? handlePointerOver : undefined}
      onPointerOut={clickable ? handlePointerOut : undefined}
    >
      {clickable ? (
        <mesh
          position={[0, 0.09, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[location.size.width + 1.2, location.size.depth + 1.2]} />
          <meshBasicMaterial transparent opacity={0.002} depthWrite={false} />
        </mesh>
      ) : null}

      <mesh receiveShadow position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[location.size.width + 0.52, location.size.depth + 0.52]} />
        <meshStandardMaterial
          color={selected || hovered || targetable ? "#7C3AED" : "#101827"}
          emissive={selected || hovered || targetable ? "#7C3AED" : "#0B0F1A"}
          emissiveIntensity={selected || hovered || targetable ? 0.28 : 0.06}
          transparent
          opacity={selected || hovered || targetable ? 0.42 : interactionActive ? 0.12 : 0.24}
        />
      </mesh>

      <BuildingMesh location={location} />

      {(selected || hovered || targetable || location.effect) && (
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.55, 1.78, 36]} />
          <meshBasicMaterial color={targetable ? "#D946EF" : selected || hovered ? "#22D3EE" : pulseColor} transparent opacity={0.52} />
        </mesh>
      )}

      <Text
        position={[0, location.size.height + 1.05, 0]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.28}
        color="#F5F7FF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.018}
        outlineColor="#0B0F1A"
      >
        {location.name}
      </Text>

      {hovered ? (
        <Html position={[0, location.size.height + 1.32, 0]} center>
          <div className="world-tooltip">
            <strong>{location.name}</strong>
            <span>{tooltipText ?? "Cliquer pour cibler ce lieu"}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export default LocationMesh;
