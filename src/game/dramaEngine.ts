import { historicalTitles } from "../data/eventTemplates";
import type { DramaArc, GameEvent, GameState, NPC } from "./types";
import { clamp, makeId, MAX_EVENTS, pick } from "./constants";

const arcTopicFor = (npc: NPC) => {
  if (npc.stats.shame > 72) return "honte publique";
  if (npc.stats.suspicion > 70) return "rumeur";
  if (npc.stats.reputation < -35) return "reputation";
  return "rivalite";
};

const createHistoricEvent = (state: GameState, arc: DramaArc): GameEvent => ({
  id: makeId("event"),
  timestamp: state.time,
  title: "Evenement historique",
  description: `La ville se souviendra de cette journee comme: "${arc.title}". Personne n'est d'accord sur la version courte.`,
  involvedNpcIds: arc.involvedNpcIds,
  type: "historic",
  intensity: Math.max(82, arc.intensity),
});

export const evaluateDrama = (state: GameState): GameState => {
  let nextState = state;
  const newArcs: DramaArc[] = [];

  state.npcs.forEach((npc) => {
    const hotRelationship = Object.values(npc.relationships).find(
      (relationship) =>
        relationship.rivalry < -50 ||
        relationship.rivalry + relationship.resentment > 105 ||
        relationship.jealousy > 70,
    );
    const statTrigger = npc.stats.suspicion > 76 || npc.stats.shame > 78 || npc.stats.reputation < -42;

    if (!hotRelationship && !statTrigger) return;

    const involvedNpcIds = hotRelationship ? [npc.id, hotRelationship.targetNpcId] : [npc.id];
    const topic = arcTopicFor(npc);
    const alreadyExists = nextState.dramaArcs.some(
      (arc) => arc.topic === topic && involvedNpcIds.every((id) => arc.involvedNpcIds.includes(id)) && arc.stage !== "resolved",
    );

    if (!alreadyExists) {
      newArcs.push({
        id: makeId("arc"),
        title: pick(historicalTitles),
        topic,
        involvedNpcIds,
        intensity: clamp(52 + npc.stats.stress * 0.28 + npc.stats.suspicion * 0.25),
        stage: "starting",
        memories: npc.memories.slice(0, 3).map((memory) => memory.id),
      });
    }
  });

  const objectArcCandidate = state.objects.find((object) => object.discoveredByNpcIds.length >= 3 || object.dramaPotential > 82);
  if (objectArcCandidate) {
    const alreadyExists = nextState.dramaArcs.some((arc) => arc.topic === objectArcCandidate.id && arc.stage !== "resolved");
    if (!alreadyExists) {
      newArcs.push({
        id: makeId("arc"),
        title: objectArcCandidate.name.includes("Chaise") ? "Le complot de la chaise doree" : `L'affaire ${objectArcCandidate.name}`,
        topic: objectArcCandidate.id,
        involvedNpcIds: objectArcCandidate.discoveredByNpcIds,
        intensity: objectArcCandidate.dramaPotential,
        stage: "starting",
        memories: [],
      });
    }
  }

  if (newArcs.length > 0) {
    const arc = newArcs[0];
    const event: GameEvent = {
      id: makeId("event"),
      timestamp: state.time,
      title: "Drama emergent",
      description: `"${arc.title}" commence a circuler. La ville vient de donner un nom a un probleme qui n'en demandait pas.`,
      involvedNpcIds: arc.involvedNpcIds,
      type: "drama",
      intensity: arc.intensity,
    };

    nextState = {
      ...nextState,
      dramaArcs: [...newArcs, ...nextState.dramaArcs].slice(0, 8),
      events: [event, ...nextState.events].slice(0, MAX_EVENTS),
      townStats: {
        ...nextState.townStats,
        drama: clamp(nextState.townStats.drama + 12),
        chaos: clamp(nextState.townStats.chaos + 6),
      },
    };
  }

  const progressedArcs = nextState.dramaArcs.map((arc) => {
    const recentMentions = nextState.events.slice(0, 12).filter((event) =>
      arc.involvedNpcIds.some((id) => event.involvedNpcIds.includes(id)),
    ).length;
    const intensity = clamp(arc.intensity + recentMentions * 1.6 - (arc.stage === "peak" ? 0.8 : 0.2));
    const stage = intensity > 82 ? "peak" : intensity > 64 ? "spreading" : intensity < 35 ? "resolved" : arc.stage;

    return { ...arc, intensity, stage };
  });

  const peakArc = progressedArcs.find(
    (arc) =>
      arc.stage === "peak" &&
      !nextState.events.some((event) => event.type === "historic" && event.description.includes(arc.title)),
  );

  if (peakArc) {
    nextState = {
      ...nextState,
      events: [createHistoricEvent(nextState, peakArc), ...nextState.events].slice(0, MAX_EVENTS),
      townStats: {
        ...nextState.townStats,
        historyScore: clamp(nextState.townStats.historyScore + 16),
        drama: clamp(nextState.townStats.drama + 8),
      },
    };
  }

  return {
    ...nextState,
    dramaArcs: progressedArcs,
  };
};
