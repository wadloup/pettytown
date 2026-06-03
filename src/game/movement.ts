import type { GameState, Location, NPC, Vector3Data } from "./types";
import { pick, WORLD_RADIUS } from "./constants";
import { getClosestRelationship } from "./relationships";

const distance2D = (a: Vector3Data, b: Vector3Data) => Math.hypot(a.x - b.x, a.z - b.z);

export const distanceBetween = distance2D;

export const randomPointNear = (position: Vector3Data, radius = 0.9): Vector3Data => {
  const angle = Math.random() * Math.PI * 2;
  const length = Math.random() * radius;

  return {
    x: Math.max(-WORLD_RADIUS, Math.min(WORLD_RADIUS, position.x + Math.cos(angle) * length)),
    y: 0,
    z: Math.max(-WORLD_RADIUS, Math.min(WORLD_RADIUS, position.z + Math.sin(angle) * length)),
  };
};

export const findLocation = (locations: Location[], id: string) =>
  locations.find((location) => location.id === id) ?? locations[0];

export const nearestNpcs = (npc: NPC, state: GameState, radius = 2.1) =>
  state.npcs
    .filter((candidate) => candidate.id !== npc.id && candidate.zoneId === npc.zoneId)
    .map((candidate) => ({ npc: candidate, distance: distance2D(candidate.position, npc.position) }))
    .filter((candidate) => candidate.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

const chooseLocationForMood = (npc: NPC, state: GameState) => {
  const availableLocations = state.locations.filter((location) => location.zoneId === npc.zoneId);
  const rival = getClosestRelationship(npc, "rival");
  const object = state.objects.find((worldObject) => worldObject.zoneId === npc.zoneId && !worldObject.discoveredByNpcIds.includes(npc.id));

  if (object && (npc.personality.includes("parano") || npc.personality.includes("opportuniste") || Math.random() > 0.68)) {
    return {
      locationId: npc.locationId,
      targetPosition: randomPointNear(object.position, 0.55),
    };
  }

  if (npc.stats.stress > 72) return availableLocations.find((location) => location.id === "park") ?? pick(availableLocations);
  if (npc.personality.includes("ambitieux")) return availableLocations.find((location) => location.id === "office") ?? pick(availableLocations);
  if (npc.personality.includes("opportuniste")) return availableLocations.find((location) => location.id === "shop") ?? pick(availableLocations);
  if (npc.personality.includes("dramatique")) return availableLocations.find((location) => location.id === "town_square") ?? pick(availableLocations);
  if (rival && rival.rivalry + rival.resentment > 95 && Math.random() > 0.45) {
    const rivalNpc = state.npcs.find((candidate) => candidate.id === rival.targetNpcId);
    if (rivalNpc) {
      const farLocations = [...availableLocations].sort(
        (a, b) => distance2D(b.position, rivalNpc.position) - distance2D(a.position, rivalNpc.position),
      );
      return farLocations[0];
    }
  }

  return pick(availableLocations);
};

export const chooseNextDestination = (npc: NPC, state: GameState): NPC => {
  const chosen = chooseLocationForMood(npc, state);

  if ("targetPosition" in chosen) {
    return { ...npc, targetPosition: chosen.targetPosition, currentAction: "inspecte un objet bizarre" };
  }

  return {
    ...npc,
    locationId: chosen.id,
    targetPosition: randomPointNear(chosen.position, Math.max(chosen.size.width, chosen.size.depth) * 0.45),
    currentAction: `marche vers ${chosen.name}`,
  };
};

export const moveNpc = (npc: NPC, state: GameState, delta: number) => {
  const distance = distance2D(npc.position, npc.targetPosition);

  if (distance < 0.16) {
    if (Math.random() > 0.46) return chooseNextDestination(npc, state);

    return {
      ...npc,
      currentAction: npc.currentAction.includes("observe") ? "hesite avec conviction" : "observe les alentours",
    };
  }

  const speed = 0.55 + (npc.stats.stress / 100) * 0.22 + (npc.personality.includes("impulsif") ? 0.16 : 0);
  const step = Math.min(distance, speed * delta);
  const dx = npc.targetPosition.x - npc.position.x;
  const dz = npc.targetPosition.z - npc.position.z;
  const angle = Math.atan2(dx, dz);

  return {
    ...npc,
    position: {
      x: npc.position.x + (dx / distance) * step,
      y: 0,
      z: npc.position.z + (dz / distance) * step,
    },
    rotationY: angle,
  };
};

export const moveNpcToLocation = (npc: NPC, location: Location) => ({
  ...npc,
  zoneId: location.zoneId,
  locationId: location.id,
  targetPosition: randomPointNear(location.position, Math.max(location.size.width, location.size.depth) * 0.42),
  currentAction: `rejoint ${location.name}`,
});
