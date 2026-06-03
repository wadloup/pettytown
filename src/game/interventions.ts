import { intrusiveThoughts, opportunityLines, tinyDisasters } from "../data/dialogueTemplates";
import { objectCatalog } from "../data/objects";
import type { GameEvent, GameState, Intervention, NPC, StatusIcon } from "./types";
import { clamp, makeId, MAX_EVENTS, pick } from "./constants";
import { generateNarrativeEvent } from "./eventGenerator";
import { createMemory, addMemoryToNpcs } from "./memory";
import { distanceBetween, moveNpcToLocation, randomPointNear } from "./movement";
import { adjustRelationship } from "./relationships";
import { recalculateTownStats } from "./scoring";

export const interventions: Intervention[] = [
  {
    id: "rumor",
    name: "Lancer une rumeur",
    cost: 15,
    description: "Accroche un soupcon absurde a un PNJ.",
    target: "npc",
    visualIcon: "rumor",
  },
  {
    id: "anonymous_message",
    name: "Notification anonyme",
    cost: 20,
    description: "Envoie un message ambigu a quelqu'un.",
    target: "npc",
    visualIcon: "phone",
  },
  {
    id: "weird_object",
    name: "Objet bizarre",
    cost: 25,
    description: "Fait apparaitre une preuve sans dossier.",
    target: "location",
    visualIcon: "weird",
  },
  {
    id: "intrusive_thought",
    name: "Pensee intrusive",
    cost: 18,
    description: "Glisse une mauvaise idee brillante.",
    target: "npc",
    visualIcon: "idea",
  },
  {
    id: "opportunity",
    name: "Creer une opportunite",
    cost: 22,
    description: "Offre une chance de briller ou de se rater.",
    target: "npc",
    visualIcon: "opportunity",
  },
  {
    id: "jealousy",
    name: "Rendre jaloux",
    cost: 24,
    description: "Choisis deux PNJ, le premier jalouse le second.",
    target: "npc_pair",
    visualIcon: "jealousy",
  },
  {
    id: "party",
    name: "Organiser une fete",
    cost: 30,
    description: "Rassemble les PNJ dans un lieu fragile.",
    target: "location",
    visualIcon: "party",
  },
  {
    id: "power_outage",
    name: "Panne d'electricite",
    cost: 26,
    description: "Plonge un lieu dans le soupcon pratique.",
    target: "location",
    visualIcon: "power",
  },
  {
    id: "money",
    name: "Donner de l'argent",
    cost: 16,
    description: "Augmente le portefeuille et l'ego d'un PNJ.",
    target: "npc",
    visualIcon: "money",
  },
  {
    id: "minor_disaster",
    name: "Catastrophe mineure",
    cost: 21,
    description: "Declenche un probleme quotidien tres mal gere.",
    target: "location",
    visualIcon: "stress",
  },
];

export const getIntervention = (id?: Intervention["id"]) => interventions.find((intervention) => intervention.id === id);

const withIcon = (npc: NPC, icon: StatusIcon): NPC => ({
  ...npc,
  statusIcons: [icon, ...npc.statusIcons.filter((item) => item !== icon)].slice(0, 3),
});

const updateNpc = (npcs: NPC[], npcId: string, updater: (npc: NPC) => NPC) =>
  npcs.map((npc) => (npc.id === npcId ? updater(npc) : npc));

const createEvent = (state: GameState, event: Omit<GameEvent, "id" | "timestamp">): GameEvent => ({
  id: makeId("event"),
  timestamp: state.time,
  ...event,
});

const addEvent = (state: GameState, event: GameEvent) => ({
  ...state,
  events: [event, ...state.events].slice(0, MAX_EVENTS),
});

const spendInfluence = (state: GameState, intervention: Intervention) => ({
  ...state,
  player: {
    ...state.player,
    influence: clamp(state.player.influence - intervention.cost, 0, state.player.maxInfluence),
  },
});

const finalize = (state: GameState, chaosDelta: number, dramaDelta: number, weirdnessDelta = 0) => {
  const withStats = {
    ...state,
    selectedInterventionId: undefined,
    pendingPairFirstNpcId: undefined,
    player: {
      ...state.player,
      totalChaosCreated: state.player.totalChaosCreated + chaosDelta,
    },
    townStats: {
      ...state.townStats,
      chaos: clamp(state.townStats.chaos + chaosDelta),
      drama: clamp(state.townStats.drama + dramaDelta),
      weirdness: clamp(state.townStats.weirdness + weirdnessDelta),
    },
  };

  return {
    ...withStats,
    townStats: recalculateTownStats(withStats),
  };
};

export const applyIntervention = (
  state: GameState,
  interventionId: Intervention["id"],
  targetId: string,
  secondaryTargetId?: string,
): GameState => {
  const intervention = getIntervention(interventionId);
  if (!intervention || state.player.influence < intervention.cost) return state;

  const paid = spendInfluence(state, intervention);

  if (intervention.id === "rumor") {
    const target = paid.npcs.find((npc) => npc.id === targetId);
    if (!target) return state;

    const nearby = paid.npcs
      .filter((npc) => npc.id !== target.id && distanceBetween(npc.position, target.position) < 3)
      .slice(0, 4);
    const description = `Une voix sans source affirme que ${target.name} cache quelque chose. ${nearby[0]?.name ?? "La ville"} repete "je ne juge pas" avec beaucoup trop d'energie.`;
    let npcs = updateNpc(paid.npcs, target.id, (npc) =>
      withIcon(
        {
          ...npc,
          stats: {
            ...npc.stats,
            suspicion: clamp(npc.stats.suspicion + 19),
            stress: clamp(npc.stats.stress + 10),
            reputation: clamp(npc.stats.reputation - 8, -100, 100),
          },
          currentThought: "Pourquoi tout le monde me regarde comme un panneau d'affichage ?",
          currentAction: "cherche la source d'une rumeur",
        },
        "rumor",
      ),
    );

    nearby.forEach((npc) => {
      npcs = adjustRelationship(npcs, npc.id, target.id, { trust: -11, resentment: 5, rivalry: 3 });
    });

    const memory = createMemory(paid.time, description, [target.id, ...nearby.map((npc) => npc.id)], 64, "rumor", 18);
    const event = createEvent(paid, {
      title: "Rumeur lancee",
      description,
      involvedNpcIds: [target.id, ...nearby.map((npc) => npc.id)],
      type: "rumor",
      intensity: 56 + nearby.length * 5,
    });

    return finalize(addEvent({ ...paid, npcs: addMemoryToNpcs(npcs, [target.id, ...nearby.map((npc) => npc.id)], memory) }, event), 9, 12);
  }

  if (intervention.id === "anonymous_message") {
    const target = paid.npcs.find((npc) => npc.id === targetId);
    if (!target) return state;

    const event = createEvent(paid, {
      title: "Notification anonyme",
      description: `${target.name} recoit: "On sait." Le probleme, c'est que personne ne sait quoi.`,
      involvedNpcIds: [target.id],
      type: "chaos",
      intensity: 58,
    });

    const npcs = updateNpc(paid.npcs, target.id, (npc) =>
      withIcon(
        {
          ...npc,
          stats: {
            ...npc.stats,
            stress: clamp(npc.stats.stress + 17),
            suspicion: clamp(npc.stats.suspicion + 22),
            mood: clamp(npc.stats.mood - 5),
          },
          currentThought: "Ce message etait soit une menace, soit une newsletter tres mal ecrite.",
          currentAction: "mene une enquete personnelle",
        },
        "phone",
      ),
    );

    const memory = createMemory(paid.time, event.description, [target.id], 59, "secret", 12);
    return finalize(addEvent({ ...paid, npcs: addMemoryToNpcs(npcs, [target.id], memory) }, event), 8, 9, 2);
  }

  if (intervention.id === "weird_object") {
    const location = paid.locations.find((candidate) => candidate.id === targetId);
    if (!location) return state;

    const catalogItem = pick(objectCatalog);
    const worldObject = {
      id: makeId("object"),
      ...catalogItem,
      position: randomPointNear(location.position, Math.max(location.size.width, location.size.depth) * 0.42),
      discoveredByNpcIds: [],
    };
    const generated = generateNarrativeEvent({ trigger: "object", object: worldObject, location, state: paid });
    const event = createEvent(paid, {
      title: generated.title,
      description: generated.description,
      involvedNpcIds: [],
      locationId: location.id,
      type: "chaos",
      intensity: worldObject.dramaPotential,
    });

    return finalize(addEvent({ ...paid, objects: [worldObject, ...paid.objects].slice(0, 12) }, event), 10, 8, 18);
  }

  if (intervention.id === "intrusive_thought") {
    const target = paid.npcs.find((npc) => npc.id === targetId);
    if (!target) return state;

    const thought = pick(intrusiveThoughts);
    const event = createEvent(paid, {
      title: "Mauvaise inspiration",
      description: `${target.name} pense: "${thought}" La ville n'a pas encore ete consultee.`,
      involvedNpcIds: [target.id],
      type: "minor",
      intensity: 50,
    });

    const npcs = updateNpc(paid.npcs, target.id, (npc) =>
      withIcon(
        {
          ...npc,
          stats: {
            ...npc.stats,
            ego: clamp(npc.stats.ego + 8),
            stress: clamp(npc.stats.stress + (npc.personality.includes("impulsif") ? 4 : 9)),
          },
          currentThought: thought,
          currentAction: "s'apprete a improviser",
        },
        "idea",
      ),
    );

    return finalize(addEvent({ ...paid, npcs }, event), 6, 7);
  }

  if (intervention.id === "opportunity") {
    const target = paid.npcs.find((npc) => npc.id === targetId);
    if (!target) return state;

    const success = target.stats.aura + target.stats.ego + Math.random() * 80 > 110;
    const generated = generateNarrativeEvent({ trigger: "opportunity", actor: target, state: paid });
    const event = createEvent(paid, {
      title: success ? "Occasion convertie" : "Occasion mal rangee",
      description: success
        ? `${target.name} ${pick(opportunityLines)}. Deux personnes applaudissent avant de comprendre pourquoi.`
        : `${target.name} voit une opportunite, la prend a l'envers, puis appelle ca une strategie.`,
      involvedNpcIds: [target.id],
      type: success ? "relationship" : "chaos",
      intensity: success ? 49 : 63,
    });

    const npcs = updateNpc(paid.npcs, target.id, (npc) =>
      withIcon(
        {
          ...npc,
          stats: {
            ...npc.stats,
            aura: clamp(npc.stats.aura + (success ? 13 : -4)),
            reputation: clamp(npc.stats.reputation + (success ? 10 : -7), -100, 100),
            money: clamp(npc.stats.money + (success ? 9 : 1)),
            shame: clamp(npc.stats.shame + (success ? 0 : 11)),
          },
          currentThought: generated.suggestedFollowUp,
          currentAction: success ? "savoure son micro-succes" : "reformule son echec",
        },
        "opportunity",
      ),
    );

    return finalize(addEvent({ ...paid, npcs }, event), success ? 4 : 10, success ? 4 : 11);
  }

  if (intervention.id === "jealousy") {
    const jealous = paid.npcs.find((npc) => npc.id === targetId);
    const visible = paid.npcs.find((npc) => npc.id === secondaryTargetId);
    if (!jealous || !visible || jealous.id === visible.id) return state;

    let npcs = updateNpc(paid.npcs, jealous.id, (npc) =>
      withIcon(
        {
          ...npc,
          stats: {
            ...npc.stats,
            stress: clamp(npc.stats.stress + 12),
            mood: clamp(npc.stats.mood - 8),
            suspicion: clamp(npc.stats.suspicion + 8),
          },
          currentThought: `${visible.name} recoit trop d'attention pour quelqu'un qui respire normalement.`,
          currentAction: `surveille ${visible.name}`,
        },
        "jealousy",
      ),
    );
    npcs = adjustRelationship(npcs, jealous.id, visible.id, { jealousy: 28, rivalry: 18, resentment: 10, trust: -8 });

    const event = createEvent(paid, {
      title: "Jalousie discrete",
      description: `${jealous.name} trouve que ${visible.name} prend beaucoup trop de lumiere pour une journee aussi petite.`,
      involvedNpcIds: [jealous.id, visible.id],
      type: "relationship",
      intensity: 64,
    });

    const memory = createMemory(paid.time, event.description, [jealous.id, visible.id], 66, "conflict", 15);
    return finalize(addEvent({ ...paid, npcs: addMemoryToNpcs(npcs, [jealous.id, visible.id], memory) }, event), 9, 13);
  }

  if (intervention.id === "party") {
    const location = paid.locations.find((candidate) => candidate.id === targetId);
    if (!location) return state;

    const invited = [...paid.npcs]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .map((npc) => npc.id);
    const npcs = paid.npcs.map((npc) =>
      invited.includes(npc.id)
        ? withIcon(
            {
              ...moveNpcToLocation(npc, location),
              stats: { ...npc.stats, mood: clamp(npc.stats.mood + 6), stress: clamp(npc.stats.stress + 4) },
              currentThought: "Une fete improvisee est soit une opportunite, soit une preuve.",
            },
            "party",
          )
        : npc,
    );
    const locations = paid.locations.map((candidate) =>
      candidate.id === location.id ? { ...candidate, effect: "party" as const, effectUntil: paid.time + 150 } : candidate,
    );
    const event = createEvent(paid, {
      title: "Fete improvisee",
      description: `${location.name} devient soudainement le centre social de la ville. Personne ne sait qui a apporte l'ambiance.`,
      involvedNpcIds: invited,
      locationId: location.id,
      type: "chaos",
      intensity: 72,
    });

    return finalize(addEvent({ ...paid, npcs, locations }, event), 14, 15, 5);
  }

  if (intervention.id === "power_outage") {
    const location = paid.locations.find((candidate) => candidate.id === targetId);
    if (!location) return state;

    const present = paid.npcs.filter((npc) => distanceBetween(npc.position, location.position) < 2.7).map((npc) => npc.id);
    const npcs = paid.npcs.map((npc) =>
      present.includes(npc.id)
        ? withIcon(
            {
              ...npc,
              stats: { ...npc.stats, stress: clamp(npc.stats.stress + 15), suspicion: clamp(npc.stats.suspicion + 10) },
              currentAction: "accuse l'electricite d'avoir un agenda",
            },
            "power",
          )
        : npc,
    );
    const locations = paid.locations.map((candidate) =>
      candidate.id === location.id ? { ...candidate, effect: "power_outage" as const, effectUntil: paid.time + 120 } : candidate,
    );
    const event = createEvent(paid, {
      title: "Panne d'electricite",
      description: `${location.name} s'assombrit. Les PNJ presents decident que la panne est probablement personnelle.`,
      involvedNpcIds: present,
      locationId: location.id,
      type: "chaos",
      intensity: 69,
    });

    return finalize(addEvent({ ...paid, npcs, locations }, event), 12, 12, 4);
  }

  if (intervention.id === "money") {
    const target = paid.npcs.find((npc) => npc.id === targetId);
    if (!target) return state;

    const nearby = paid.npcs.filter((npc) => npc.id !== target.id && distanceBetween(npc.position, target.position) < 2.6);
    let npcs = updateNpc(paid.npcs, target.id, (npc) =>
      withIcon(
        {
          ...npc,
          stats: {
            ...npc.stats,
            money: clamp(npc.stats.money + 24),
            ego: clamp(npc.stats.ego + 12),
            aura: clamp(npc.stats.aura + 5),
          },
          currentThought: "Je merite probablement cet argent mysterieux.",
          currentAction: "marche avec une confiance neuve",
        },
        "money",
      ),
    );
    nearby.forEach((npc) => {
      npcs = adjustRelationship(npcs, npc.id, target.id, { jealousy: 12, resentment: 4 });
    });

    const event = createEvent(paid, {
      title: "Argent sans explication",
      description: `${target.name} trouve de l'argent. Les autres appellent ca de la chance avec une diction tres froide.`,
      involvedNpcIds: [target.id, ...nearby.map((npc) => npc.id)],
      type: "relationship",
      intensity: 47 + nearby.length * 4,
    });

    return finalize(addEvent({ ...paid, npcs }, event), 5, 8);
  }

  if (intervention.id === "minor_disaster") {
    const location = paid.locations.find((candidate) => candidate.id === targetId);
    if (!location) return state;

    const present = paid.npcs.filter((npc) => distanceBetween(npc.position, location.position) < 2.7).map((npc) => npc.id);
    const problem = pick(tinyDisasters);
    const locations = paid.locations.map((candidate) =>
      candidate.id === location.id ? { ...candidate, effect: "minor_disaster" as const, effectUntil: paid.time + 90 } : candidate,
    );
    const npcs = paid.npcs.map((npc) =>
      present.includes(npc.id)
        ? withIcon(
            {
              ...npc,
              stats: { ...npc.stats, stress: clamp(npc.stats.stress + 9), shame: clamp(npc.stats.shame + 4) },
              currentThought: "Je vais avoir une opinion beaucoup trop forte.",
            },
            "stress",
          )
        : npc,
    );
    const event = createEvent(paid, {
      title: "Catastrophe mineure",
      description: `A ${location.name}, ${problem}. La reaction collective est plus grande que le probleme.`,
      involvedNpcIds: present,
      locationId: location.id,
      type: "chaos",
      intensity: 58,
    });

    return finalize(addEvent({ ...paid, npcs, locations }, event), 11, 10, 3);
  }

  return state;
};
