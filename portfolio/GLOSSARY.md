# Portfolio Axel Doussoux — Lexique du Domaine

Ce lexique définit le vocabulaire canonique de l'interface, de la direction artistique et des mécanismes d'interaction du portfolio.

## Direction Artistique & Style

**Light Neo-Brutalism**:
Esthétique combinant géométrie stricte à angles vifs (`border-radius: 0`), bordures noires franches (`2px solid #000000`), ombres dures décalées sans flou et texture minérale légère (film grain & blueprint grid).
_Avoid_: Soft brutalism, Flat design, Skeuomorphisme

**Duo Chromatique Cobalt & Hyper-Violet**:
Système de deux accents néon à haute saturation (`#0055FF` bleu roi et `#7C3AED` violet électrique) apportant tension visuelle, hiérarchie et élévation sur un fond neutre clair.
_Avoid_: Monochrome, Dégradé pastellisé, Rainbow accents

**Ombre Brutaliste (Hard Offset Shadow)**:
Ombre portée purement décalée sans flou gaussien (`box-shadow: 4px 4px 0px #000000`), projetant l'élément comme une plaque physique en relief.
_Avoid_: Drop shadow floue, Box-shadow diffuse, Glow doux

**Blueprint Grid**:
Grille architecturale millimétrée en filigrane évoquant les schémas techniques et le travail d'ingénierie logicielle.
_Avoid_: Motif décoratif aléatoire, Fond transparent vide

## Mécaniques de Défilement & Motion

**Sticky Stacking**:
Composant de défilement immersif où chaque carte de projet s'ancre en haut de la fenêtre et est recouverte par la carte suivante au fil du scroll avec une subtile échelle de profondeur.
_Avoid_: Carrousel horizontal infini, Accordéon classique, Grille statique répétitive

**Divulgation Progressive**:
Principe ergonomique consistant à ne présenter immédiatement que les informations prioritaires, et à révéler les détails techniques (stack complète, métriques secondaires) par interaction intentionnelle (onglets, modale, expansion).
_Avoid_: Dumping d'informations, Écran monolithique, Surcharge cognitive

**Tactile Physics**:
Micro-interactions simulant l'enfoncement mécanique réel des boutons (`translate(2px, 2px)` et réduction de l'ombre à zéro au clic) orchestrées avec réactivité immédiate.
_Avoid_: Animation de clic élastique/rebondissante, Transition de fade standard

**Pre-computation d'Accessibilité**:
Bypass immédiat désactivant les déplacements physiques et les scrubbings continus au scroll lorsque `prefers-reduced-motion: reduce` est actif, tout en maintenant la lisibilité intégrale du contenu.
_Avoid_: Animation ignorée sans alternative accessible

**Scroll Indicator**:
Élément visuel cinétique situé au bas du premier écran invitant au défilement par un glissement rythmé sur rail sans bloquer l'interaction.
_Avoid_: Simple flèche rebondissante statique, Pop-up incitative

**Hub d'Onglets Interactif**:
Composant de filtrage par boutons-onglets instantanés permettant de commuter entre les spécialités techniques avec réorganisation animée du layout sans rechargement.
_Avoid_: Multi-select encombrant, Grille exhaustive non filtrée

**Session Boot Memory**:
Mécanisme mémorisant l'exécution du Boot Screen initial dans `sessionStorage` afin d'éviter la répétition de l'animation lors de navigations ultérieures au sein de la même session.
_Avoid_: Animation forcée à chaque retour, Cookie persistant intrusif

