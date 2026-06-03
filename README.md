# PettyTown

PettyTown est un jeu navigateur de simulation sociale absurde. Une petite ville 3D low-poly vit toute seule : les PNJ se deplacent, gardent des relations, accumulent des souvenirs et transforment de petits incidents quotidiens en dramas disproportionnes. Le joueur ne controle pas directement les personnages ; il perturbe la ville avec des interventions et observe les consequences.

## Lancer le projet

```bash
npm install
npm run dev
```

Verifications utiles :

```bash
npm run typecheck
npm run build
npm run lint
```

## Fichiers importants

- `src/App.tsx` : layout principal du jeu.
- `src/components/three/` : scene 3D, ville, PNJ, objets et billboards.
- `src/components/ui/` : top bar, journal, interventions, fiche PNJ, resume.
- `src/game/initialState.ts` : generation d'une nouvelle ville.
- `src/game/simulation.ts` : boucle `tickGame`.
- `src/game/interventions.ts` : actions d'influence du joueur.
- `src/game/npcAI.ts` : decisions autonomes des PNJ.
- `src/game/dramaEngine.ts` : detection et progression des arcs de drama.
- `src/game/eventGenerator.ts` : couche narrative template-first, prete pour une IA externe.
- `src/game/saveLoad.ts` : sauvegarde locale via `localStorage`.
- `src/data/` : noms, traits, secrets, lieux, objets et textes.

## Ajouter une intervention

1. Ajouter l'entree dans `interventions` dans `src/game/interventions.ts`.
2. Ajouter son comportement dans `applyIntervention`.
3. Ajouter une icone dans `src/components/ui/InterventionPanel.tsx`.
4. Si elle cree un effet 3D, ajouter un `StatusIcon` dans `src/game/types.ts` et son rendu dans `StatusBillboard.tsx`.

## Ajouter du contenu PNJ

- Noms : `src/data/npcNames.ts`
- Traits : `src/data/personalityTraits.ts`
- Secrets : `src/data/secrets.ts`
- Objectifs : `src/data/goals.ts`
- Templates de journal : `src/data/eventTemplates.ts`

La generation initiale tire automatiquement dans ces listes.

## Ajouter un objet 3D

1. Ajouter l'objet dans `src/data/objects.ts`.
2. Ajouter son type dans `WorldObject` dans `src/game/types.ts`.
3. Ajouter sa couleur et sa geometrie dans `src/components/three/ObjectMesh.tsx`.

## Brancher une vraie IA plus tard

Le point d'extension est `generateNarrativeEvent(context)` dans `src/game/eventGenerator.ts`. La simulation garde les regles structurees dans les stats, relations et souvenirs ; une API IA peut remplacer ou enrichir les textes, les changements de stats et les effets proposes sans casser la boucle de jeu.

Le format cible est un JSON court avec titre, description, PNJ impliques, changements de stats, changements relationnels, effets monde et nouveaux souvenirs.
