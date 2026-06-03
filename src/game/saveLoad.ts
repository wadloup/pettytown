import type { GameState } from "./types";
import { SAVE_KEY } from "./constants";
import { generateInitialState } from "./initialState";
import { getNpcVisualProfile } from "../data/npcVisuals";

export const saveGame = (state: GameState) => {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
};

export const loadGame = (): GameState | undefined => {
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as GameState;
    if (!Array.isArray(parsed.npcs) || !Array.isArray(parsed.events)) return undefined;
    return {
      ...parsed,
      npcs: parsed.npcs.map((npc, index) => {
        const visual = npc.visual ?? getNpcVisualProfile(index, npc.personality);

        return {
          ...npc,
          visual,
          title: npc.title ?? visual.title,
          avatarColor: visual.primary,
        };
      }),
    };
  } catch {
    return undefined;
  }
};

export const clearSave = () => {
  window.localStorage.removeItem(SAVE_KEY);
};

export const loadOrCreateGame = () => loadGame() ?? generateInitialState();
