import type { GameState } from "./types";

export const selectNpcById = (state: GameState, npcId?: string) =>
  npcId ? state.npcs.find((npc) => npc.id === npcId) : undefined;

export const selectLocationById = (state: GameState, locationId?: string) =>
  locationId ? state.locations.find((location) => location.id === locationId) : undefined;

export const selectedNpc = (state: GameState) => selectNpcById(state, state.selectedNpcId);

export const selectedLocation = (state: GameState) => selectLocationById(state, state.selectedLocationId);

export const historicalEvents = (state: GameState) => state.events.filter((event) => event.type === "historic");

export const recentEvents = (state: GameState, count = 25) => state.events.slice(0, count);
