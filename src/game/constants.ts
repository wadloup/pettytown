export const SAVE_KEY = "pettytown.save.v1";
export const MAX_EVENTS = 80;
export const MAX_MEMORIES_PER_NPC = 10;
export const TICK_SECONDS = 1.2;
export const WORLD_RADIUS = 7.2;

export const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const sample = <T>(items: T[], count: number): T[] => {
  const pool = [...items];
  const result: T[] = [];

  while (pool.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    const [item] = pool.splice(index, 1);
    result.push(item);
  }

  return result;
};

export const makeId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const formatGameTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const hour = 9 + Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};
