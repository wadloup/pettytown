export type TutorialFocus = "intro" | "npcs" | "interventions" | "journal" | "free";

export type TutorialStep = {
  id: string;
  title: string;
  body: string;
  focus: TutorialFocus;
};

export const TUTORIAL_KEY = "pettytown.tutorial.done.v1";

export const tutorialSteps: TutorialStep[] = [
  {
    id: "intro",
    title: "Bienvenue a PettyTown",
    body: "Ici, les PNJ vivent leur vie. Tu ne les controles pas directement : tu perturbes leur monde.",
    focus: "intro",
  },
  {
    id: "npcs",
    title: "Observe les habitants",
    body: "Clique sur un PNJ pour voir sa personnalite, ses relations, ses secrets et son humeur.",
    focus: "npcs",
  },
  {
    id: "interventions",
    title: "Choisis une intervention",
    body: "Une intervention change le monde social. Le jeu affichera les cibles valides.",
    focus: "interventions",
  },
  {
    id: "first-action",
    title: "Premiere perturbation",
    body: "Essaie de lancer une rumeur sur un PNJ et regarde la ville reagir.",
    focus: "interventions",
  },
  {
    id: "journal",
    title: "Lis les consequences",
    body: "Le journal raconte les reactions, les conflits et les evenements historiques.",
    focus: "journal",
  },
  {
    id: "free",
    title: "Laisse partir en vrille",
    body: "Maintenant, observe. Les petites histoires vont commencer a se propager.",
    focus: "free",
  },
];

export const isTutorialDone = () => window.localStorage.getItem(TUTORIAL_KEY) === "done";

export const markTutorialDone = () => {
  window.localStorage.setItem(TUTORIAL_KEY, "done");
};
