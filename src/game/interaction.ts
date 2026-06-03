import { getIntervention } from "./interventions";
import type { InteractionState, Intervention } from "./types";

export const idleInstruction = "Choisis une intervention ou clique sur un PNJ.";

export const idleInteraction: InteractionState = {
  mode: "idle",
  instructionText: idleInstruction,
};

const instructionByIntervention: Record<Intervention["id"], string> = {
  rumor: "Clique sur un PNJ pour lancer une rumeur.",
  anonymous_message: "Clique sur un PNJ pour envoyer une notification anonyme.",
  weird_object: "Clique sur un lieu pour faire apparaitre un objet bizarre.",
  intrusive_thought: "Clique sur un PNJ pour envoyer une pensee intrusive.",
  opportunity: "Clique sur un PNJ pour creer une opportunite.",
  jealousy: "Choisis deux PNJ : le premier deviendra jaloux du second.",
  party: "Clique sur un lieu pour organiser une fete.",
  power_outage: "Clique sur un lieu pour provoquer une panne d'electricite.",
  money: "Clique sur un PNJ pour donner de l'argent.",
  minor_disaster: "Clique sur un lieu pour declencher une catastrophe mineure.",
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
    instructionText: instructionByIntervention[intervention.id],
  };
};

export const buildSecondNpcInteraction = (interventionId: Intervention["id"], firstSelectedNpcId: string): InteractionState => ({
  mode: "selecting_two_npcs",
  selectedInterventionId: interventionId,
  firstSelectedNpcId,
  instructionText: "Choisis le second PNJ : le premier deviendra jaloux.",
});

export const withHoveredTarget = (interaction: InteractionState, hoveredTargetId?: string): InteractionState => ({
  ...interaction,
  hoveredTargetId,
});

export const resetInteraction = (instructionText = idleInstruction): InteractionState => ({
  mode: "idle",
  instructionText,
});
