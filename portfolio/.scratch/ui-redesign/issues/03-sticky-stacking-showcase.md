# 03: Showcase Projets en Sticky Stacking Cards & Archive

**What to build:**
Remplacer la grille de cartes statique par une expérience de défilement immersif moderne où les projets phares (featured) s'empilent au scroll avec ancrage sticky et effet d'échelle subtil via `motion` (v14). Chaque carte présente un format bi-colonne asymétrique (55% média avec grand visuel, cadre brutaliste et ombres alternées bleu cobalt / hyper-violet ; 45% cas d'étude avec numéro monumental `[01 / 04]`, typographie Syne, stack bicolore et bouton direct vers le cas d'étude complet). Les projets secondaires sont présentés dans une grille compacte épurée.

**Blocked by:**
01: Intégration des Tokens Hyper-Violet & Ambiance Blueprint

**Status:** closed (completed)

- [x] Implémenter le composant `StickyProjectStack` basé sur `motion` (`useScroll`, `useTransform`) avec conteneur sticky
- [x] Concevoir le layout bi-colonne asymétrique pour chaque projet phare
- [x] Alterner les ombres portées franches (`.brutal-shadow-blue` et `.brutal-shadow-purple`) d'une carte à l'autre
- [x] Connecter le bouton d'ouverture du cas d'étude détaillé (`openProjectPage` / `ProjectDetailPage`)
- [x] Intégrer une grille compacte secondaire pour les réalisations additionnelles
- [x] Garantir le repli sans animation pour `prefers-reduced-motion` (affichage vertical fluide propre sans scale)
