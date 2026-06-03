export type InputIntent =
  | { type: "npc_click"; npcId: string }
  | { type: "location_click"; locationId: string }
  | { type: "hover"; targetId?: string }
  | { type: "cancel_interaction" };
