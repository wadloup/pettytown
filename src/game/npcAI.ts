import type { GameState, NPC, NPCAction } from "./types";
import { pick } from "./constants";
import { nearestNpcs } from "./movement";
import { getClosestRelationship } from "./relationships";
import { generateNarrativeEvent } from "./eventGenerator";

export const decideNpcAction = (npc: NPC, state: GameState): NPCAction | undefined => {
  const nearby = nearestNpcs(npc, state, 2.25);
  const undiscoveredObject = state.objects.find(
    (worldObject) =>
      !worldObject.discoveredByNpcIds.includes(npc.id) &&
      Math.hypot(worldObject.position.x - npc.position.x, worldObject.position.z - npc.position.z) < 2.4,
  );

  if (undiscoveredObject && Math.random() > 0.38) {
    const generated = generateNarrativeEvent({ trigger: "inspect_object", actor: npc, object: undiscoveredObject, state });
    return {
      type: "inspect_object",
      actorNpcId: npc.id,
      objectId: undiscoveredObject.id,
      title: generated.title,
      description: generated.description,
      intensity: 48 + Math.round(undiscoveredObject.dramaPotential * 0.25),
    };
  }

  if (nearby.length === 0) return undefined;

  const rival = getClosestRelationship(npc, "rival");
  const friend = getClosestRelationship(npc, "friend");
  const target =
    (rival && nearby.find((candidate) => candidate.npc.id === rival.targetNpcId)?.npc) ??
    (friend && nearby.find((candidate) => candidate.npc.id === friend.targetNpcId)?.npc) ??
    pick(nearby).npc;

  if (!target) return undefined;

  const relation = npc.relationships[target.id];
  const shouldConfront =
    npc.stats.stress > 58 ||
    relation.rivalry + relation.resentment > 86 ||
    (npc.personality.includes("rancunier") && relation.resentment > 44);
  const shouldSpreadRumor =
    npc.personality.includes("mythomane") ||
    npc.personality.includes("manipulateur") ||
    (npc.personality.includes("parano") && npc.stats.suspicion > 52);
  const shouldBoast = npc.personality.includes("ambitieux") || npc.stats.ego > 72;

  let type: NPCAction["type"] = "talk";
  let trigger = "autonomous";

  if (shouldConfront && Math.random() > 0.36) {
    type = "confront";
    trigger = "conflict";
  } else if (shouldSpreadRumor && Math.random() > 0.58) {
    type = "spread_rumor";
    trigger = "rumor";
  } else if (relation.resentment > 62 && Math.random() > 0.48) {
    type = "avoid";
  } else if (shouldBoast && Math.random() > 0.5) {
    type = "boast";
  } else if (npc.personality.includes("loyal") && relation.friendship > 38) {
    type = "apologize";
  } else if (npc.personality.includes("opportuniste")) {
    type = "scheme";
  }

  const generated = generateNarrativeEvent({ trigger, actor: npc, target, state });

  return {
    type,
    actorNpcId: npc.id,
    targetNpcId: target.id,
    title: type === "spread_rumor" ? "Rumeur autonome" : generated.title,
    description: generated.description,
    intensity:
      type === "confront"
        ? 62 + Math.round(Math.random() * 18)
        : type === "spread_rumor"
          ? 55 + Math.round(Math.random() * 16)
          : 30 + Math.round(Math.random() * 24),
  };
};
