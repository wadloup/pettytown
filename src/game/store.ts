import { create } from "zustand";
import type { GameState, Intervention } from "./types";
import { generateInitialState } from "./initialState";
import { applyIntervention, getIntervention } from "./interventions";
import { clearSave, loadOrCreateGame, saveGame } from "./saveLoad";
import { tickGame } from "./simulation";

type GameStore = GameState & {
  tick: () => void;
  selectNpc: (npcId: string) => void;
  selectLocation: (locationId: string) => void;
  chooseIntervention: (interventionId: Intervention["id"]) => void;
  cancelIntervention: () => void;
  togglePause: () => void;
  toggleSpeed: () => void;
  saveNow: () => void;
  newTown: () => void;
  toggleSummary: () => void;
  clearSelection: () => void;
};

const initial = typeof window === "undefined" ? generateInitialState() : loadOrCreateGame();

export const useGameStore = create<GameStore>((set, get) => ({
  ...initial,
  tick: () => set((state) => tickGame(state)),
  selectNpc: (npcId) =>
    set((state) => {
      const selectedIntervention = getIntervention(state.selectedInterventionId);

      if (selectedIntervention?.target === "npc") {
        return applyIntervention(state, selectedIntervention.id, npcId);
      }

      if (selectedIntervention?.target === "npc_pair") {
        if (!state.pendingPairFirstNpcId || state.pendingPairFirstNpcId === npcId) {
          return {
            ...state,
            selectedNpcId: npcId,
            pendingPairFirstNpcId: npcId,
          };
        }

        return applyIntervention(state, selectedIntervention.id, state.pendingPairFirstNpcId, npcId);
      }

      return {
        ...state,
        selectedNpcId: npcId,
        selectedLocationId: undefined,
      };
    }),
  selectLocation: (locationId) =>
    set((state) => {
      const selectedIntervention = getIntervention(state.selectedInterventionId);

      if (selectedIntervention?.target === "location") {
        return applyIntervention(state, selectedIntervention.id, locationId);
      }

      return {
        ...state,
        selectedLocationId: locationId,
        selectedNpcId: undefined,
      };
    }),
  chooseIntervention: (interventionId) =>
    set((state) => ({
      ...state,
      selectedInterventionId: state.selectedInterventionId === interventionId ? undefined : interventionId,
      pendingPairFirstNpcId: undefined,
    })),
  cancelIntervention: () => set({ selectedInterventionId: undefined, pendingPairFirstNpcId: undefined }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  toggleSpeed: () => set((state) => ({ speed: state.speed === 1 ? 2 : 1 })),
  saveNow: () => saveGame(get()),
  clearSelection: () => set({ selectedNpcId: undefined, selectedLocationId: undefined }),
  newTown: () =>
    set(() => {
      clearSave();
      return generateInitialState();
    }),
  toggleSummary: () => set((state) => ({ summaryOpen: !state.summaryOpen })),
}));

if (typeof window !== "undefined") {
  useGameStore.subscribe((state) => saveGame(state));
}
