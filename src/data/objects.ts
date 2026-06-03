import type { WorldObject } from "../game/types";

export const objectCatalog: Array<Pick<WorldObject, "name" | "type" | "importance" | "dramaPotential">> = [
  { name: "Boite rouge", type: "red_box", importance: 54, dramaPotential: 74 },
  { name: "Chaise doree", type: "golden_chair", importance: 68, dramaPotential: 82 },
  { name: "Telephone abandonne", type: "lost_phone", importance: 63, dramaPotential: 78 },
  { name: "Enveloppe mysterieuse", type: "mystery_letter", importance: 72, dramaPotential: 84 },
  { name: "Faux trophee", type: "fake_trophy", importance: 58, dramaPotential: 79 },
  { name: "Pancarte ne pas toucher", type: "sign", importance: 49, dramaPotential: 66 },
];
