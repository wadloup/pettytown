import type { PersonalityTrait } from "../game/types";

export const personalityTraits: PersonalityTrait[] = [
  "susceptible",
  "mythomane",
  "loyal",
  "jaloux",
  "ambitieux",
  "discret",
  "opportuniste",
  "naif",
  "manipulateur",
  "dramatique",
  "parano",
  "genereux",
  "rancunier",
  "charmeur",
  "impulsif",
];

export const traitThoughts: Record<PersonalityTrait, string[]> = {
  susceptible: ["Personne n'a assez remarque mon calme.", "Je sens qu'on parle de moi."],
  mythomane: ["Une version plus impressionnante de cette histoire existe surement.", "Je pourrais dire que j'etais la."],
  loyal: ["Si quelqu'un touche a mes amis, je deviens procedure administrative.", "Je dois verifier que tout le monde va bien."],
  jaloux: ["Pourquoi cette personne a plus d'aura que moi ?", "Je peux etre content pour eux. En theorie."],
  ambitieux: ["Cette ville manque de leadership, et de moi.", "Il me faut un plan avec un nom."],
  discret: ["Je vais observer depuis le banc le moins suspect.", "Moins je parle, plus j'apprends."],
  opportuniste: ["Tout probleme est une boutique temporaire.", "Je pourrais monetiser cette confusion."],
  naif: ["C'est peut-etre une tradition locale.", "Je vais croire la premiere explication polie."],
  manipulateur: ["Une petite phrase au bon moment suffit.", "Je peux arranger ca pour que ca ait l'air naturel."],
  dramatique: ["Le silence de la place centrale est une provocation.", "Je ressens un acte trois arriver."],
  parano: ["Tout le monde marche trop normalement.", "Ce panneau sait quelque chose."],
  genereux: ["Je peux aider, meme si personne n'a demande.", "Un compliment mal place peut reparer une journee."],
  rancunier: ["Je n'ai pas oublie le banc de mardi.", "La patience est une vengeance qui prend son temps."],
  charmeur: ["Un sourire peut desamorcer ou aggraver. Essayons.", "Je vais parler comme si j'avais un public."],
  impulsif: ["Je decide maintenant et je justifie apres.", "La prudence manque de panache."],
};
