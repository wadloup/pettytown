import type { GameEvent, GameState, NPC, StatusIcon } from "./types";
import { clamp, makeId, MAX_EVENTS, TICK_SECONDS } from "./constants";
import { evaluateDrama } from "./dramaEngine";
import { createMemory, addMemoryToNpcs, pruneMemories } from "./memory";
import { moveNpc } from "./movement";
import { decideNpcAction } from "./npcAI";
import { adjustRelationship } from "./relationships";
import { recalculateTownStats, eventInfluenceReward } from "./scoring";

const actionIcon: Record<string, StatusIcon> = {
  talk: "idea",
  avoid: "stress",
  confront: "conflict",
  spread_rumor: "rumor",
  excuse: "stress",
  boast: "aura",
  inspect_object: "weird",
  apologize: "aura",
  scheme: "secret",
};

const deriveStatusIcons = (npc: NPC): StatusIcon[] => {
  const icons: StatusIcon[] = [];

  if (npc.stats.stress > 70) icons.push("stress");
  if (npc.stats.suspicion > 70) icons.push("secret");
  if (npc.stats.aura > 72) icons.push("aura");
  if (Object.values(npc.relationships).some((relationship) => relationship.jealousy > 70)) icons.push("jealousy");

  return [...npc.statusIcons, ...icons].filter((icon, index, list) => list.indexOf(icon) === index).slice(0, 3);
};

const updateNpc = (npcs: NPC[], npcId: string, updater: (npc: NPC) => NPC) =>
  npcs.map((npc) => (npc.id === npcId ? updater(npc) : npc));

const makeEvent = (state: GameState, event: Omit<GameEvent, "id" | "timestamp">): GameEvent => ({
  id: makeId("event"),
  timestamp: state.time,
  ...event,
});

const applyAutonomousAction = (state: GameState): GameState => {
  const shuffled = [...state.npcs].sort(() => Math.random() - 0.5);
  const action = shuffled.map((npc) => decideNpcAction(npc, state)).find(Boolean);

  if (!action) return state;

  const involvedNpcIds = [action.actorNpcId, action.targetNpcId].filter(Boolean) as string[];
  const event = makeEvent(state, {
    title: action.title,
    description: action.description,
    involvedNpcIds,
    type: action.type === "confront" ? "drama" : action.type === "spread_rumor" ? "rumor" : "minor",
    intensity: action.intensity,
  });

  let npcs = updateNpc(state.npcs, action.actorNpcId, (npc) => ({
    ...npc,
    stats: {
      ...npc.stats,
      stress: clamp(npc.stats.stress + (action.type === "confront" ? 9 : action.type === "avoid" ? -2 : 3)),
      mood: clamp(npc.stats.mood + (action.type === "apologize" ? 4 : action.type === "confront" ? -6 : 1)),
      ego: clamp(npc.stats.ego + (action.type === "boast" ? 7 : 0)),
      suspicion: clamp(npc.stats.suspicion + (action.type === "spread_rumor" ? 5 : 0)),
    },
    currentAction:
      action.type === "inspect_object"
        ? "inspecte un objet bizarre"
        : action.targetNpcId
          ? `interagit avec ${state.npcs.find((npcCandidate) => npcCandidate.id === action.targetNpcId)?.name ?? "quelqu'un"}`
          : "improvise socialement",
    currentThought:
      action.type === "boast"
        ? "Si je parle assez fort, les gens vont croire que je maitrise la situation."
        : action.type === "confront"
          ? "Je vais demander une explication claire et en creer trois nouvelles."
          : npc.currentThought,
    statusIcons: [actionIcon[action.type], ...npc.statusIcons].filter(Boolean).slice(0, 3) as StatusIcon[],
  }));

  if (action.targetNpcId) {
    npcs = updateNpc(npcs, action.targetNpcId, (npc) => ({
      ...npc,
      stats: {
        ...npc.stats,
        stress: clamp(npc.stats.stress + (action.type === "confront" ? 10 : action.type === "spread_rumor" ? 8 : 2)),
        suspicion: clamp(npc.stats.suspicion + (action.type === "spread_rumor" ? 10 : 0)),
        reputation: clamp(npc.stats.reputation + (action.type === "spread_rumor" ? -5 : 0), -100, 100),
      },
      statusIcons: [action.type === "spread_rumor" ? "rumor" : "stress", ...npc.statusIcons].slice(0, 3) as StatusIcon[],
    }));

    if (action.type === "confront") {
      npcs = adjustRelationship(npcs, action.actorNpcId, action.targetNpcId, { rivalry: 8, resentment: 12, trust: -7 });
      npcs = adjustRelationship(npcs, action.targetNpcId, action.actorNpcId, { rivalry: 6, resentment: 9, trust: -5 });
    } else if (action.type === "apologize") {
      npcs = adjustRelationship(npcs, action.actorNpcId, action.targetNpcId, { friendship: 5, trust: 6, resentment: -6 });
    } else if (action.type === "spread_rumor") {
      npcs = adjustRelationship(npcs, action.actorNpcId, action.targetNpcId, { trust: -8, rivalry: 4 });
    } else {
      npcs = adjustRelationship(npcs, action.actorNpcId, action.targetNpcId, {
        friendship: Math.random() > 0.45 ? 4 : -3,
        trust: Math.random() > 0.55 ? 3 : -2,
      });
    }
  }

  let objects = state.objects;
  if (action.objectId) {
    objects = state.objects.map((object) =>
      object.id === action.objectId
        ? {
            ...object,
            discoveredByNpcIds: [action.actorNpcId, ...object.discoveredByNpcIds.filter((id) => id !== action.actorNpcId)].slice(0, 10),
          }
        : object,
    );
  }

  const memory = createMemory(state.time, action.description, involvedNpcIds, action.intensity, action.type === "spread_rumor" ? "rumor" : "public_event");
  const withEvent = {
    ...state,
    npcs: addMemoryToNpcs(npcs, involvedNpcIds, memory),
    objects,
    events: [event, ...state.events].slice(0, MAX_EVENTS),
    lastAutonomousEventAt: state.time,
    player: {
      ...state.player,
      influence: clamp(state.player.influence + eventInfluenceReward(action.intensity), 0, state.player.maxInfluence),
    },
  };

  return {
    ...withEvent,
    townStats: recalculateTownStats(withEvent),
  };
};

export const tickGame = (state: GameState): GameState => {
  if (state.isPaused) return state;

  const movementDelta = TICK_SECONDS * state.speed;
  const nextTime = state.time + 28 * state.speed;
  const movedState: GameState = {
    ...state,
    time: nextTime,
    player: {
      ...state.player,
      influence: clamp(state.player.influence + 1.6 * state.speed, 0, state.player.maxInfluence),
    },
    locations: state.locations.map((location) =>
      location.effectUntil && location.effectUntil < nextTime ? { ...location, effect: undefined, effectUntil: undefined } : location,
    ),
    npcs: state.npcs.map((npc) => {
      const moved = moveNpc(npc, state, movementDelta);
      return {
        ...moved,
        stats: {
          ...moved.stats,
          stress: clamp(moved.stats.stress - 0.5),
          mood: clamp(moved.stats.mood + 0.16),
        },
        statusIcons: deriveStatusIcons(moved),
      };
    }),
  };

  const shouldCreateEvent = nextTime - state.lastAutonomousEventAt > 95 + Math.random() * 90;
  const withAction = shouldCreateEvent ? applyAutonomousAction(movedState) : movedState;
  const withPrunedMemories = {
    ...withAction,
    npcs: pruneMemories(withAction.npcs, withAction.time),
  };
  const withDrama = evaluateDrama(withPrunedMemories);

  return {
    ...withDrama,
    townStats: recalculateTownStats(withDrama),
  };
};
