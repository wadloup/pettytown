import type { GameState, Location, Vector3Data } from "./types";
import type { ZoneDefinition, ZoneId } from "./zoneTypes";

export const zones: Record<ZoneId, ZoneDefinition> = {
  town_center: {
    id: "town_center",
    name: "Town Center",
    subtitle: "La ville exterieure garde un oeil sur tout le monde.",
    kind: "outdoor",
  },
  interior_cafe: {
    id: "interior_cafe",
    name: "Cafe des Soupirs",
    subtitle: "Lieu sensible aux rumeurs.",
    kind: "interior",
  },
};

export const interiorCafeLocation: Location = {
  id: "interior_cafe_main",
  name: "Cafe des Soupirs",
  type: "cafe",
  zoneId: "interior_cafe",
  position: { x: 0, y: 0, z: 0 },
  size: { width: 5.6, depth: 4.2, height: 0.18 },
  color: "#D946EF",
  vibe: "rumeurs servies en lumiere basse",
};

export const getZone = (zoneId: ZoneId) => zones[zoneId];

export const getDefaultLocationForZone = (locations: Location[], zoneId: ZoneId) =>
  locations.find((location) => location.zoneId === zoneId) ?? locations[0];

export const isInteriorZone = (zoneId: ZoneId) => zones[zoneId].kind === "interior";

export const zoneSpawnPoint = (zoneId: ZoneId): Vector3Data =>
  zoneId === "interior_cafe" ? { x: 0, y: 0, z: 1.25 } : { x: -4.25, y: 0, z: 0.9 };

export const describeWithZoneContext = (state: GameState, description: string, locationId?: string) => {
  const location = locationId ? state.locations.find((candidate) => candidate.id === locationId) : undefined;
  const zoneId = location?.zoneId ?? state.currentZoneId;

  if (!isInteriorZone(zoneId)) return description;
  if (description.startsWith("Au ") || description.startsWith("A ")) return description;

  const zone = getZone(zoneId);
  return `Au ${zone.name}, ${description.charAt(0).toLowerCase()}${description.slice(1)}`;
};
