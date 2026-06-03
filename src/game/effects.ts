import type { FeedbackToast, GameState, Intervention, VisualEffect } from "./types";
import { makeId } from "./constants";

const effectByIntervention: Record<Intervention["id"], Pick<VisualEffect, "type" | "color" | "duration" | "label">> = {
  rumor: { type: "rumor_wave", color: "#D946EF", duration: 150, label: "Rumeur" },
  anonymous_message: { type: "glitch", color: "#22D3EE", duration: 120, label: "Ping" },
  weird_object: { type: "weird_halo", color: "#A855F7", duration: 180, label: "Anomalie" },
  intrusive_thought: { type: "idea_flash", color: "#F59E0B", duration: 130, label: "Idee" },
  opportunity: { type: "opportunity_star", color: "#22D3EE", duration: 130, label: "Chance" },
  jealousy: { type: "jealousy_flare", color: "#FB7185", duration: 150, label: "Jalousie" },
  party: { type: "party_pulse", color: "#D946EF", duration: 180, label: "Fete" },
  power_outage: { type: "power_flicker", color: "#60A5FA", duration: 150, label: "Panne" },
  money: { type: "money_spark", color: "#34D399", duration: 130, label: "Cash" },
  minor_disaster: { type: "minor_alert", color: "#F97316", duration: 150, label: "Alerte" },
};

const toastToneByType: Record<string, FeedbackToast["tone"]> = {
  rumor: "drama",
  drama: "drama",
  historic: "warning",
  relationship: "info",
  chaos: "warning",
  minor: "info",
};

export const createVisualEffect = (
  interventionId: Intervention["id"],
  targetType: VisualEffect["targetType"],
  targetId: string,
  time: number,
): VisualEffect => ({
  id: makeId("fx"),
  targetType,
  targetId,
  createdAt: time,
  ...effectByIntervention[interventionId],
});

export const addPostActionFeedback = (
  previous: GameState,
  next: GameState,
  interventionId: Intervention["id"],
  targetType: VisualEffect["targetType"],
  targetId: string,
): GameState => {
  const newestEvent = next.events[0];
  const hadNewEvent = previous.events[0]?.id !== newestEvent?.id;

  if (!hadNewEvent || !newestEvent) return next;

  const effect = createVisualEffect(interventionId, targetType, targetId, next.time);
  const feedback: FeedbackToast = {
    id: makeId("feedback"),
    title: newestEvent.title,
    description: newestEvent.description,
    createdAt: next.time,
    tone: toastToneByType[newestEvent.type] ?? "info",
  };

  return {
    ...next,
    selectedInterventionId: undefined,
    pendingPairFirstNpcId: undefined,
    interaction: {
      mode: "idle",
      instructionText: "Action appliquee : observe les reactions.",
    },
    effects: [effect, ...next.effects].slice(0, 12),
    feedbacks: [feedback, ...next.feedbacks].slice(0, 4),
  };
};

export const pruneVisualFeedback = (state: GameState): GameState => ({
  ...state,
  effects: state.effects.filter((effect) => state.time - effect.createdAt < effect.duration),
  feedbacks: state.feedbacks.filter((feedback) => state.time - feedback.createdAt < 150),
});
