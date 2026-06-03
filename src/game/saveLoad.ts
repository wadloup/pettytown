import type { GameState } from "./types";
import { SAVE_KEY } from "./constants";
import { generateInitialState } from "./initialState";
import { getNpcVisualProfile } from "../data/npcVisuals";
import { idleInteraction } from "./interaction";
import { randomPointNear } from "./movement";
import type { Location, NPC, WorldObject } from "./types";
import type { ZoneId } from "./zoneTypes";
import { interiorCafeLocation } from "./zones";

const cafeResidentIndexes = new Set([0, 3, 6, 8]);

const migrateLocation = (location: Location): Location => ({
  ...location,
  zoneId: location.zoneId ?? "town_center",
  interiorZoneId: location.id === "cafe" ? "interior_cafe" : location.interiorZoneId,
});

const migrateNpcZone = (npc: NPC, index: number): ZoneId => npc.zoneId ?? (cafeResidentIndexes.has(index) ? "interior_cafe" : "town_center");

const migrateObject = (object: WorldObject): WorldObject => ({
  ...object,
  zoneId: object.zoneId ?? "town_center",
});

const getStorage = () => {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

export const saveGame = (state: GameState) => {
  getStorage()?.setItem(SAVE_KEY, JSON.stringify(state));
};

export const loadGame = (): GameState | undefined => {
  const raw = getStorage()?.getItem(SAVE_KEY);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as GameState;
    if (!Array.isArray(parsed.npcs) || !Array.isArray(parsed.events)) return undefined;
    const savedLocations = Array.isArray(parsed.locations) ? parsed.locations.map(migrateLocation) : [];
    const locations = savedLocations.some((location) => location.id === interiorCafeLocation.id)
      ? savedLocations
      : [...savedLocations, { ...interiorCafeLocation, position: { ...interiorCafeLocation.position }, size: { ...interiorCafeLocation.size } }];

    return {
      ...parsed,
      npcs: parsed.npcs.map((npc, index) => {
        const visual = npc.visual ?? getNpcVisualProfile(index, npc.personality);
        const zoneId = migrateNpcZone(npc, index);
        const location = zoneId === "interior_cafe" ? interiorCafeLocation : locations.find((candidate) => candidate.id === npc.locationId);
        const shouldReposition = !npc.zoneId && zoneId === "interior_cafe";

        return {
          ...npc,
          visual,
          title: npc.title ?? visual.title,
          avatarColor: visual.primary,
          zoneId,
          locationId: location?.id ?? npc.locationId,
          position: shouldReposition ? randomPointNear(interiorCafeLocation.position, 1.7) : npc.position,
          targetPosition: shouldReposition ? randomPointNear(interiorCafeLocation.position, 1.7) : npc.targetPosition,
        };
      }),
      locations,
      objects: (parsed.objects ?? []).map(migrateObject),
      currentZoneId: parsed.currentZoneId ?? "town_center",
      previousZoneId: parsed.previousZoneId,
      selectedInterventionId: undefined,
      pendingPairFirstNpcId: undefined,
      interaction: idleInteraction,
      effects: [],
      feedbacks: [],
    };
  } catch {
    return undefined;
  }
};

export const clearSave = () => {
  getStorage()?.removeItem(SAVE_KEY);
};

export const loadOrCreateGame = () => loadGame() ?? generateInitialState();
