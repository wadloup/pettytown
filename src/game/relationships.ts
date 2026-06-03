import type { NPC, Relationship } from "./types";
import { clamp } from "./constants";

type RelationshipField = keyof Omit<Relationship, "targetNpcId">;

export const createRelationship = (targetNpcId: string): Relationship => ({
  targetNpcId,
  friendship: Math.round(Math.random() * 42 - 10),
  trust: Math.round(Math.random() * 48 + 8),
  jealousy: Math.round(Math.random() * 34),
  rivalry: Math.round(Math.random() * 28),
  attraction: Math.round(Math.random() * 55),
  resentment: Math.round(Math.random() * 24),
});

export const relationshipWarmth = (relationship: Relationship) =>
  relationship.friendship + relationship.trust * 0.55 + relationship.attraction * 0.2 - relationship.rivalry - relationship.resentment;

export const adjustRelationship = (
  npcs: NPC[],
  fromNpcId: string,
  toNpcId: string,
  changes: Partial<Record<RelationshipField, number>>,
) =>
  npcs.map((npc) => {
    if (npc.id !== fromNpcId) return npc;

    const current = npc.relationships[toNpcId] ?? createRelationship(toNpcId);
    const next = { ...current };

    (Object.keys(changes) as RelationshipField[]).forEach((field) => {
      next[field] = clamp(next[field] + (changes[field] ?? 0), -100, 100);
    });

    return {
      ...npc,
      relationships: {
        ...npc.relationships,
        [toNpcId]: next,
      },
    };
  });

export const getClosestRelationship = (npc: NPC, type: "friend" | "rival") => {
  const values = Object.values(npc.relationships);

  if (values.length === 0) return undefined;

  return values.sort((a, b) => {
    const scoreA = type === "friend" ? relationshipWarmth(a) : a.rivalry + a.resentment + a.jealousy;
    const scoreB = type === "friend" ? relationshipWarmth(b) : b.rivalry + b.resentment + b.jealousy;
    return scoreB - scoreA;
  })[0];
};

export const topRelationships = (npc: NPC, npcs: NPC[], limit = 4) =>
  Object.values(npc.relationships)
    .map((relationship) => ({
      relationship,
      target: npcs.find((candidate) => candidate.id === relationship.targetNpcId),
      warmth: relationshipWarmth(relationship),
    }))
    .filter((item) => item.target)
    .sort((a, b) => Math.abs(b.warmth) - Math.abs(a.warmth))
    .slice(0, limit);

export const averageTrust = (npcs: NPC[]) => {
  const relationships = npcs.flatMap((npc) => Object.values(npc.relationships));
  if (relationships.length === 0) return 50;
  return clamp(relationships.reduce((sum, relationship) => sum + relationship.trust, 0) / relationships.length);
};
