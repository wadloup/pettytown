import { Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useState } from "react";
import type { Location } from "../../game/types";
import BuildingMesh from "./BuildingMesh";

type LocationMeshProps = {
  location: Location;
  selected: boolean;
  onSelect: (locationId: string) => void;
};

function LocationMesh({ location, selected, onSelect }: LocationMeshProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(location.id);
  };

  const pulseColor =
    location.effect === "party" ? "#f97316" : location.effect === "power_outage" ? "#475569" : location.effect ? "#ef4444" : "#ffffff";

  return (
    <group
      position={[location.position.x, 0, location.position.z]}
      onClick={handleClick}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh receiveShadow position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[location.size.width + 0.52, location.size.depth + 0.52]} />
        <meshStandardMaterial
          color={selected || hovered ? "#7C3AED" : "#101827"}
          emissive={selected || hovered ? "#7C3AED" : "#0B0F1A"}
          emissiveIntensity={selected || hovered ? 0.24 : 0.06}
          transparent
          opacity={selected || hovered ? 0.42 : 0.24}
        />
      </mesh>

      <BuildingMesh location={location} />

      {(selected || hovered || location.effect) && (
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.55, 1.78, 36]} />
          <meshBasicMaterial color={selected || hovered ? "#22D3EE" : pulseColor} transparent opacity={0.52} />
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
    </group>
  );
}

export default LocationMesh;
