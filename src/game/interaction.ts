import { getIntervention } from "./interventions";
import type { InteractionState, Intervention } from "./types";

export const idleInstruction = "Choisis une intervention ou clique sur un PNJ.";

export const idleInteraction: InteractionState = {
  mode: "idle",
  instructionText: idleInstruction,
};

const targetText: Record<Intervention["target"], string> = {
  npc: "Clique sur un PNJ cible.",
  location: "Clique sur un lieu cible.",
  npc_pair: "Choisis le premier PNJ.",
};

export const modeForIntervention = (intervention: Intervention): InteractionState["mode"] => {
  if (intervention.id === "weird_object") return "placing_object";
  if (intervention.target === "npc") return "selecting_npc";
  if (intervention.target === "location") return "selecting_location";
  return "selecting_two_npcs";
};

export const buildInteractionForIntervention = (interventionId: Intervention["id"]): InteractionState => {
  const intervention = getIntervention(interventionId);

  if (!intervention) return idleInteraction;

  return {
    mode: modeForIntervention(intervention),
    selectedInterventionId: intervention.id,
    instructionText: targetText[intervention.target],
  };
};

export const buildSecondNpcInteraction = (interventionId: Intervention["id"], firstSelectedNpcId: string): InteractionState => ({
  mode: "selecting_two_npcs",
  selectedInterventionId: interventionId,
  firstSelectedNpcId,
  instructionText: "Choisis un deuxieme PNJ.",
});

export const withHoveredTarget = (interaction: InteractionState, hoveredTargetId?: string): InteractionState => ({
  ...interaction,
  hoveredTargetId,
});

export const resetInteraction = (instructionText = idleInstruction): InteractionState => ({
  mode: "idle",
  instructionText,
});
