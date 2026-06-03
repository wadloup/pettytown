import { goals } from "../data/goals";
import { baseLocations } from "../data/locations";
import { npcNames } from "../data/npcNames";
import { getNpcVisualProfile } from "../data/npcVisuals";
import { personalityTraits, traitThoughts } from "../data/personalityTraits";
import { secrets } from "../data/secrets";
import type { GameEvent, GameState, NPC } from "./types";
import { makeId, pick, sample } from "./constants";
import { idleInteraction } from "./interaction";
import { createRelationship } from "./relationships";
import { randomPointNear } from "./movement";

const initialEvents: GameEvent[] = [
  {
    id: makeId("event"),
    timestamp: 0,
    title: "Calme suspect",
    description: "La ville semble calme, ce qui est rarement bon signe.",
    involvedNpcIds: [],
    type: "minor",
    intensity: 22,
  },
  {
    id: makeId("event"),
    timestamp: 70,
    title: "Premiere posture",
    description: "Yanis pretend deja connaitre tout le monde. Trois personnes le laissent continuer par curiosite.",
    involvedNpcIds: ["npc_0"],
    type: "minor",
    intensity: 31,
  },
  {
    id: makeId("event"),
    timestamp: 140,
    title: "Observation intense",
    description: "Lina observe la place centrale comme si elle preparait une annonce qui n'existe pas encore.",
    involvedNpcIds: ["npc_1"],
    type: "minor",
    intensity: 34,
  },
];

const createNpc = (index: number): NPC => {
  const location = baseLocations[index % baseLocations.length];
  const traits = sample(personalityTraits, 2 + (Math.random() > 0.62 ? 1 : 0));
  const visual = getNpcVisualProfile(index, traits);
  const thoughtPool = traits.flatMap((trait) => traitThoughts[trait]);
  const position = randomPointNear(location.position, 1.15);

  return {
    id: `npc_${index}`,
    name: npcNames[index],
    age: 20 + Math.floor(Math.random() * 39),
    avatarColor: visual.primary,
    title: visual.title,
    visual,
    locationId: location.id,
    position,
    targetPosition: randomPointNear(location.position, 1.4),
    rotationY: Math.random() * Math.PI * 2,
    personality: traits,
    secret: secrets[index % secrets.length],
    goal: goals[index % goals.length],
    stats: {
      mood: 46 + Math.round(Math.random() * 28),
      stress: 18 + Math.round(Math.random() * 28),
      ego: 28 + Math.round(Math.random() * 55),
      aura: 30 + Math.round(Math.random() * 46),
      shame: Math.round(Math.random() * 22),
      suspicion: 8 + Math.round(Math.random() * 22),
      money: 20 + Math.round(Math.random() * 70),
      reputation: -10 + Math.round(Math.random() * 42),
    },
    relationships: {},
    memories: [],
    currentThought: pick(thoughtPool),
    currentAction: `traine vers ${location.name}`,
    statusIcons: index < 2 ? ["aura"] : [],
    tags: [],
  };
};

const withRelationships = (npcs: NPC[]) =>
  npcs.map((npc) => ({
    ...npc,
    relationships: Object.fromEntries(
      npcs.filter((target) => target.id !== npc.id).map((target) => [target.id, createRelationship(target.id)]),
    ),
  }));

export const generateInitialState = (): GameState => {
  const npcs = withRelationships(Array.from({ length: 10 }, (_, index) => createNpc(index)));

  return {
    npcs,
    locations: baseLocations.map((location) => ({ ...location, position: { ...location.position }, size: { ...location.size } })),
    objects: [],
    events: initialEvents,
    dramaArcs: [],
    townStats: {
      chaos: 24,
      happiness: 58,
      drama: 18,
      trust: 54,
      weirdness: 22,
      historyScore: 0,
    },
    player: {
      influence: 100,
      maxInfluence: 100,
      totalChaosCreated: 0,
      discoveredSecrets: [],
    },
    selectedNpcId: undefined,
    selectedLocationId: undefined,
    selectedInterventionId: undefined,
    pendingPairFirstNpcId: undefined,
    isPaused: false,
    speed: 1,
    time: 0,
    lastAutonomousEventAt: 0,
    summaryOpen: false,
    interaction: idleInteraction,
    effects: [],
    feedbacks: [],
  };
};
