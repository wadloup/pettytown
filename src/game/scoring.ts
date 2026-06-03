import type { GameState, TownStats } from "./types";
import { clamp } from "./constants";
import { averageTrust } from "./relationships";

export const recalculateTownStats = (state: GameState): TownStats => {
  const npcCount = Math.max(1, state.npcs.length);
  const averageStress = state.npcs.reduce((sum, npc) => sum + npc.stats.stress, 0) / npcCount;
  const averageMood = state.npcs.reduce((sum, npc) => sum + npc.stats.mood, 0) / npcCount;
  const averageSuspicion = state.npcs.reduce((sum, npc) => sum + npc.stats.suspicion, 0) / npcCount;
  const conflictWeight = state.dramaArcs.reduce((sum, arc) => sum + arc.intensity, 0) / Math.max(1, state.dramaArcs.length || 1);
  const recentIntensity =
    state.events.slice(0, 8).reduce((sum, event) => sum + event.intensity, 0) / Math.max(1, state.events.slice(0, 8).length);

  return {
    chaos: clamp(state.townStats.chaos * 0.74 + averageStress * 0.18 + recentIntensity * 0.2),
    happiness: clamp(averageMood - averageStress * 0.18 + 18),
    drama: clamp(state.townStats.drama * 0.72 + conflictWeight * 0.22 + averageSuspicion * 0.18),
    trust: averageTrust(state.npcs),
    weirdness: clamp(state.townStats.weirdness * 0.88 + state.objects.length * 4 + averageSuspicion * 0.05),
    historyScore: clamp(state.townStats.historyScore + state.events.filter((event) => event.type === "historic").length * 1.8),
  };
};

export const eventInfluenceReward = (intensity: number) => (intensity > 70 ? 4 : intensity > 45 ? 2 : 0);
