import { autonomousTemplates, conflictTemplates, objectTemplates, rumorTemplates } from "../data/eventTemplates";
import { opportunityLines } from "../data/dialogueTemplates";
import type { GeneratedNarrativeEvent, NarrativeContext } from "./types";
import { pick } from "./constants";

const fill = (template: string, values: Record<string, string | undefined>) =>
  Object.entries(values).reduce((text, [key, value]) => text.split(`{${key}}`).join(value ?? "quelqu'un"), template);

export const generateNarrativeEvent = (context: NarrativeContext): GeneratedNarrativeEvent => {
  const actorName = context.actor?.name ?? "Quelqu'un";
  const targetName = context.target?.name ?? "la ville";
  const objectName = context.object?.name ?? "l'objet bizarre";
  const locationName = context.location?.name ?? "la place";

  if (context.trigger === "rumor") {
    return {
      title: "Rumeur lancee",
      description: fill(pick(rumorTemplates), { actor: actorName, target: targetName }),
      involvedNpcIds: [context.target?.id, context.actor?.id].filter(Boolean) as string[],
      statChanges: context.target ? [{ npcId: context.target.id, stat: "suspicion", delta: 16 }] : [],
      relationshipChanges: [],
      worldEffects: context.target ? [{ type: "status_icon", targetId: context.target.id, value: "rumor" }] : [],
      newMemories: context.target
        ? [{ npcId: context.target.id, description: `${targetName} a ete touche par une rumeur floue.`, importance: 58 }]
        : [],
      suggestedFollowUp: "Un PNJ parano pourrait tenter une enquete inutile.",
    };
  }

  if (context.trigger === "object") {
    return {
      title: "Objet bizarre",
      description: `${objectName} apparait pres de ${locationName}. Les PNJ proches font semblant de savoir comment reagir.`,
      involvedNpcIds: [],
      statChanges: [],
      relationshipChanges: [],
      worldEffects: [],
      newMemories: [],
      suggestedFollowUp: "Les opportunistes vont probablement vouloir le posseder.",
    };
  }

  if (context.trigger === "opportunity" && context.actor) {
    return {
      title: "Occasion sociale",
      description: `${actorName} ${pick(opportunityLines)}.`,
      involvedNpcIds: [context.actor.id],
      statChanges: [
        { npcId: context.actor.id, stat: "aura", delta: context.actor.personality.includes("naif") ? -4 : 12 },
        { npcId: context.actor.id, stat: "ego", delta: 10 },
      ],
      relationshipChanges: [],
      worldEffects: [{ type: "status_icon", targetId: context.actor.id, value: "opportunity" }],
      newMemories: [{ npcId: context.actor.id, description: `${actorName} a cru sentir son moment arriver.`, importance: 52 }],
      suggestedFollowUp: "Une reussite trop visible peut provoquer de la jalousie.",
    };
  }

  if (context.trigger === "conflict" && context.actor && context.target) {
    return {
      title: "Clarification inutile",
      description: fill(pick(conflictTemplates), { actor: actorName, target: targetName }),
      involvedNpcIds: [context.actor.id, context.target.id],
      statChanges: [
        { npcId: context.actor.id, stat: "stress", delta: 8 },
        { npcId: context.target.id, stat: "stress", delta: 10 },
      ],
      relationshipChanges: [
        { fromNpcId: context.actor.id, toNpcId: context.target.id, field: "resentment", delta: 14 },
        { fromNpcId: context.target.id, toNpcId: context.actor.id, field: "rivalry", delta: 9 },
      ],
      worldEffects: [
        { type: "status_icon", targetId: context.actor.id, value: "conflict" },
        { type: "status_icon", targetId: context.target.id, value: "stress" },
      ],
      newMemories: [
        { npcId: context.actor.id, description: `${actorName} a confronte ${targetName}.`, importance: 63 },
        { npcId: context.target.id, description: `${targetName} a ete confronte par ${actorName}.`, importance: 63 },
      ],
      suggestedFollowUp: "La rancune peut transformer cette scene en arc de drama.",
    };
  }

  if (context.trigger === "inspect_object" && context.actor && context.object) {
    return {
      title: "Theorie locale",
      description: fill(pick(objectTemplates), { actor: actorName, object: objectName }),
      involvedNpcIds: [context.actor.id],
      statChanges: [{ npcId: context.actor.id, stat: "suspicion", delta: 8 }],
      relationshipChanges: [],
      worldEffects: [{ type: "status_icon", targetId: context.actor.id, value: "weird" }],
      newMemories: [{ npcId: context.actor.id, description: `${actorName} a inspecte ${objectName}.`, importance: 55 }],
      suggestedFollowUp: "L'objet peut devenir un sujet historique s'il attire trop de monde.",
    };
  }

  return {
    title: "Micro-evenement",
    description: fill(pick(autonomousTemplates), { actor: actorName, target: targetName }),
    involvedNpcIds: [context.actor?.id, context.target?.id].filter(Boolean) as string[],
    statChanges: context.actor ? [{ npcId: context.actor.id, stat: "mood", delta: Math.random() > 0.5 ? 4 : -3 }] : [],
    relationshipChanges:
      context.actor && context.target
        ? [{ fromNpcId: context.actor.id, toNpcId: context.target.id, field: "friendship", delta: Math.random() > 0.56 ? 8 : -5 }]
        : [],
    worldEffects: context.actor ? [{ type: "status_icon", targetId: context.actor.id, value: "idea" }] : [],
    newMemories: context.actor
      ? [{ npcId: context.actor.id, description: `${actorName} a vecu un moment social difficile a classer.`, importance: 44 }]
      : [],
    suggestedFollowUp: "La ville continue comme si ce choix etait normal.",
  };
};
