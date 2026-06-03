import type { GameState } from "./types";

export const isTargetingNpc = (state: GameState) =>
  state.interaction.mode === "selecting_npc" || state.interaction.mode === "selecting_two_npcs";

export const isTargetingLocation = (state: GameState) =>
  state.interaction.mode === "selecting_location" || state.interaction.mode === "placing_object";

export const canTargetNpc = (state: GameState, npcId: string) => {
  if (!isTargetingNpc(state)) return false;
  if (state.interaction.mode === "selecting_two_npcs" && state.interaction.firstSelectedNpcId === npcId) return false;
  return true;
};

export const canTargetLocation = (state: GameState, locationId: string) => {
  if (!isTargetingLocation(state)) return false;
  return state.locations.some((location) => location.id === locationId);
};

export const isNpcInDrama = (state: GameState, npcId: string) =>
  state.dramaArcs.some((arc) => arc.stage !== "resolved" && arc.involvedNpcIds.includes(npcId));

export const targetableNpcIds = (state: GameState) => state.npcs.filter((npc) => canTargetNpc(state, npc.id)).map((npc) => npc.id);

export const targetableLocationIds = (state: GameState) =>
  state.locations.filter((location) => canTargetLocation(state, location.id)).map((location) => location.id);
