# 1. Architecture d'Animation Hybride Motion & Anime.js v4

## Contexte
Le projet utilise initialement `animejs` (v4) pour les micro-interactions tactiles, les reveals de caractères (`SplitText`), les compteurs et l'ambiance du fond blueprint. Pour refondre l'interface avec un défilement immersif moderne (cartes empilées "Sticky Stacking", jauges de progression de scroll liées à la fenêtre), l'utilisation exclusive d'écouteurs d'événements `window.onscroll` avec Anime.js entraîne une surcharge de code impératif et des risques de saccades de rendu (jank).

## Décision
Nous adoptons une architecture cinétique hybride claire :
1. **Motion (Framer Motion v14)** prend en charge l'orchestration déclarative liée au scroll (`useScroll`, `useTransform`, Sticky Stacking des projets, transitions de présence entre filtres).
2. **Anime.js v4** est conservé pour les interactions impératives à haute fidélité tactile (physique de pression des boutons Néo-brutalistes, glitchs typographiques, reveals ponctuels).
3. **Accessibilité unifiée** : Les deux moteurs sont asservis au hook `useReducedMotion` pour neutraliser instantanément toute cinétique lors de la détection de `prefers-reduced-motion: reduce`.

## Conséquences
- Code de défilement déclaratif, robuste et performant (synchronisé avec les frames de rafraîchissement du navigateur).
- Séparation nette des responsabilités : Motion gère la scénographie macroscopique (scroll), Anime.js gère la physique microscopique (composants).
