import { create } from "zustand";
import type { GameState, Intervention } from "./types";
import { addPostActionFeedback } from "./effects";
import { generateInitialState } from "./initialState";
import { buildInteractionForIntervention, buildSecondNpcInteraction, resetInteraction, withHoveredTarget } from "./interaction";
import { applyIntervention, getIntervention } from "./interventions";
import { clearSave, loadOrCreateGame, saveGame } from "./saveLoad";
import { tickGame } from "./gameLoop";

type GameStore = GameState & {
  tick: () => void;
  selectNpc: (npcId: string) => void;
  selectLocation: (locationId: string) => void;
  chooseIntervention: (interventionId: Intervention["id"]) => void;
  cancelIntervention: () => void;
  setHoveredTarget: (targetId?: string) => void;
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
      const selectedIntervention = getIntervention(state.interaction.selectedInterventionId);

      if (state.interaction.mode === "selecting_npc" && selectedIntervention) {
        const next = applyIntervention(state, selectedIntervention.id, npcId);
        return addPostActionFeedback(state, next, selectedIntervention.id, "npc", npcId);
      }

      if (state.interaction.mode === "selecting_two_npcs" && selectedIntervention) {
        if (!state.interaction.firstSelectedNpcId) {
          return {
            ...state,
            selectedNpcId: npcId,
            pendingPairFirstNpcId: npcId,
            interaction: buildSecondNpcInteraction(selectedIntervention.id, npcId),
          };
        }

        if (state.interaction.firstSelectedNpcId === npcId) {
          return {
            ...state,
            interaction: {
              ...state.interaction,
              instructionText: "Choisis un autre PNJ pour completer l'action.",
            },
          };
        }

        const next = applyIntervention(state, selectedIntervention.id, state.interaction.firstSelectedNpcId, npcId);
        return addPostActionFeedback(state, next, selectedIntervention.id, "npc", state.interaction.firstSelectedNpcId);
      }

      if (state.interaction.mode !== "idle") return state;

      return {
        ...state,
        selectedNpcId: npcId,
        selectedLocationId: undefined,
      };
    }),
  selectLocation: (locationId) =>
    set((state) => {
      const selectedIntervention = getIntervention(state.interaction.selectedInterventionId);

      if ((state.interaction.mode === "selecting_location" || state.interaction.mode === "placing_object") && selectedIntervention) {
        const next = applyIntervention(state, selectedIntervention.id, locationId);
        return addPostActionFeedback(state, next, selectedIntervention.id, "location", locationId);
      }

      return state;
    }),
  chooseIntervention: (interventionId) =>
    set((state) => {
      const isSame = state.interaction.selectedInterventionId === interventionId;

      return {
        ...state,
        selectedInterventionId: isSame ? undefined : interventionId,
        pendingPairFirstNpcId: undefined,
        interaction: isSame ? resetInteraction() : buildInteractionForIntervention(interventionId),
      };
    }),
  cancelIntervention: () =>
    set({
      selectedInterventionId: undefined,
      pendingPairFirstNpcId: undefined,
      interaction: resetInteraction(),
    }),
  setHoveredTarget: (targetId) => set((state) => ({ interaction: withHoveredTarget(state.interaction, targetId) })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  toggleSpeed: () => set((state) => ({ speed: state.speed === 1 ? 2 : 1 })),
  saveNow: () => saveGame(get()),
  clearSelection: () =>
    set((state) =>
      state.interaction.mode === "idle" ? { selectedNpcId: undefined, selectedLocationId: undefined } : state,
    ),
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
