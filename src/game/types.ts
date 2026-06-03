import type { ZoneId } from "./zoneTypes";

export type { ZoneId } from "./zoneTypes";

export type Vector3Data = {
  x: number;
  y: number;
  z: number;
};

export type PersonalityTrait =
  | "susceptible"
  | "mythomane"
  | "loyal"
  | "jaloux"
  | "ambitieux"
  | "discret"
  | "opportuniste"
  | "naif"
  | "manipulateur"
  | "dramatique"
  | "parano"
  | "genereux"
  | "rancunier"
  | "charmeur"
  | "impulsif";

export type StatusIcon =
  | "rumor"
  | "stress"
  | "jealousy"
  | "aura"
  | "secret"
  | "phone"
  | "idea"
  | "money"
  | "party"
  | "power"
  | "weird"
  | "conflict"
  | "opportunity";

export type Relationship = {
  targetNpcId: string;
  friendship: number;
  trust: number;
  jealousy: number;
  rivalry: number;
  attraction: number;
  resentment: number;
};

export type Memory = {
  id: string;
  timestamp: number;
  type: "rumor" | "conflict" | "gift" | "embarrassment" | "opportunity" | "secret" | "public_event";
  description: string;
  emotionalImpact: number;
  involvedNpcIds: string[];
  importance: number;
};

export type NPCStats = {
  mood: number;
  stress: number;
  ego: number;
  aura: number;
  shame: number;
  suspicion: number;
  money: number;
  reputation: number;
};

export type NPCVisual = {
  title: string;
  bodyShape: "boxy" | "longcoat" | "hoodie" | "sharp" | "wide" | "street";
  hairStyle: "bob" | "spikes" | "bun" | "cap" | "mohawk" | "waves" | "hood" | "sidecut" | "halo" | "none";
  accessory: "glasses" | "visor" | "bag" | "collar" | "earring" | "scarf" | "headset" | "none";
  primary: string;
  secondary: string;
  accent: string;
  skin: string;
};

export type NPC = {
  id: string;
  name: string;
  age: number;
  avatarColor: string;
  title: string;
  visual: NPCVisual;
  zoneId: ZoneId;
  locationId: string;
  position: Vector3Data;
  targetPosition: Vector3Data;
  rotationY: number;
  personality: PersonalityTrait[];
  secret: string;
  goal: string;
  stats: NPCStats;
  relationships: Record<string, Relationship>;
  memories: Memory[];
  currentThought: string;
  currentAction: string;
  statusIcons: StatusIcon[];
  tags: string[];
};

export type Location = {
  id: string;
  name: string;
  type: "cafe" | "park" | "shop" | "town_square" | "home" | "office";
  zoneId: ZoneId;
  interiorZoneId?: ZoneId;
  position: Vector3Data;
  size: {
    width: number;
    depth: number;
    height: number;
  };
  color: string;
  vibe: string;
  effect?: "party" | "power_outage" | "minor_disaster";
  effectUntil?: number;
};

export type WorldObject = {
  id: string;
  name: string;
  type: "red_box" | "golden_chair" | "lost_phone" | "mystery_letter" | "fake_trophy" | "sign";
  zoneId: ZoneId;
  position: Vector3Data;
  importance: number;
  discoveredByNpcIds: string[];
  dramaPotential: number;
};

export type GameEvent = {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  involvedNpcIds: string[];
  locationId?: string;
  type: "minor" | "drama" | "rumor" | "relationship" | "chaos" | "historic";
  intensity: number;
};

export type DramaArc = {
  id: string;
  title: string;
  topic: string;
  involvedNpcIds: string[];
  intensity: number;
  stage: "starting" | "spreading" | "peak" | "resolved";
  memories: string[];
};

export type TownStats = {
  chaos: number;
  happiness: number;
  drama: number;
  trust: number;
  weirdness: number;
  historyScore: number;
};

export type PlayerState = {
  influence: number;
  maxInfluence: number;
  totalChaosCreated: number;
  discoveredSecrets: string[];
};

export type InterventionTarget = "npc" | "location" | "npc_pair";

export type Intervention = {
  id:
    | "rumor"
    | "anonymous_message"
    | "weird_object"
    | "intrusive_thought"
    | "opportunity"
    | "jealousy"
    | "party"
    | "power_outage"
    | "money"
    | "minor_disaster";
  name: string;
  cost: number;
  description: string;
  target: InterventionTarget;
  visualIcon: StatusIcon;
};

export type InteractionMode = "idle" | "selecting_npc" | "selecting_location" | "selecting_two_npcs" | "placing_object";

export type InteractionState = {
  mode: InteractionMode;
  selectedInterventionId?: Intervention["id"];
  firstSelectedNpcId?: string;
  hoveredTargetId?: string;
  instructionText: string;
};

export type VisualEffect = {
  id: string;
  type: "rumor_wave" | "glitch" | "idea_flash" | "jealousy_flare" | "opportunity_star" | "party_pulse" | "power_flicker" | "weird_halo" | "minor_alert" | "money_spark";
  targetType: "npc" | "location";
  targetId: string;
  color: string;
  createdAt: number;
  duration: number;
  label: string;
};

export type FeedbackToast = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  tone: "info" | "success" | "drama" | "warning";
};

export type GameState = {
  currentZoneId: ZoneId;
  previousZoneId?: ZoneId;
  npcs: NPC[];
  locations: Location[];
  objects: WorldObject[];
  events: GameEvent[];
  dramaArcs: DramaArc[];
  townStats: TownStats;
  player: PlayerState;
  selectedNpcId?: string;
  selectedLocationId?: string;
  selectedInterventionId?: Intervention["id"];
  pendingPairFirstNpcId?: string;
  isPaused: boolean;
  speed: 1 | 2;
  time: number;
  lastAutonomousEventAt: number;
  summaryOpen: boolean;
  interaction: InteractionState;
  effects: VisualEffect[];
  feedbacks: FeedbackToast[];
};

export type NPCAction = {
  type:
    | "talk"
    | "avoid"
    | "confront"
    | "spread_rumor"
    | "excuse"
    | "boast"
    | "inspect_object"
    | "apologize"
    | "scheme";
  actorNpcId: string;
  targetNpcId?: string;
  objectId?: string;
  title: string;
  description: string;
  intensity: number;
};

export type NarrativeContext = {
  trigger: string;
  actor?: NPC;
  target?: NPC;
  location?: Location;
  object?: WorldObject;
  state: GameState;
};

export type GeneratedNarrativeEvent = {
  title: string;
  description: string;
  involvedNpcIds: string[];
  statChanges: Array<{ npcId: string; stat: keyof NPCStats; delta: number }>;
  relationshipChanges: Array<{
    fromNpcId: string;
    toNpcId: string;
    field: keyof Omit<Relationship, "targetNpcId">;
    delta: number;
  }>;
  worldEffects: Array<{ type: "status_icon" | "spawn_object" | "move_npc" | "location_effect"; targetId: string; value: string }>;
  newMemories: Array<{ npcId: string; description: string; importance: number }>;
  suggestedFollowUp: string;
};
