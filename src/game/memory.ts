import type { Memory, NPC } from "./types";
import { makeId, MAX_MEMORIES_PER_NPC } from "./constants";

export const createMemory = (
  timestamp: number,
  description: string,
  involvedNpcIds: string[],
  importance: number,
  type: Memory["type"] = "public_event",
  emotionalImpact = importance - 45,
): Memory => ({
  id: makeId("mem"),
  timestamp,
  type,
  description,
  emotionalImpact,
  involvedNpcIds,
  importance,
});

export const addMemoryToNpc = (npc: NPC, memory: Memory): NPC => ({
  ...npc,
  memories: [memory, ...npc.memories]
    .sort((a, b) => b.importance + b.timestamp / 10000 - (a.importance + a.timestamp / 10000))
    .slice(0, MAX_MEMORIES_PER_NPC),
});

export const addMemoryToNpcs = (npcs: NPC[], npcIds: string[], memory: Memory) =>
  npcs.map((npc) => (npcIds.includes(npc.id) ? addMemoryToNpc(npc, memory) : npc));

export const pruneMemories = (npcs: NPC[], currentTime: number) =>
  npcs.map((npc) => ({
    ...npc,
    memories: npc.memories
      .filter((memory) => memory.importance > 42 || currentTime - memory.timestamp < 540)
      .slice(0, MAX_MEMORIES_PER_NPC),
  }));
