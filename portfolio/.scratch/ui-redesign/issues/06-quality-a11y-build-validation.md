# 06: Revue Qualité, Respect Strict prefers-reduced-motion & Validation Build

**What to build:**
Réaliser une passe complète de vérification de la qualité technique et visuelle du site refondu : vérification des contrastes WCAG AA (≥ 4.5:1), contrôle sans faille du comportement sous `prefers-reduced-motion` (neutralisation instantanée des animations continues, de l'échelle des cartes au scroll et des transitions sans rupture de disposition), vérification du responsive mobile/tablette/desktop, et validation de `npm run build` et `npm run lint`.

**Blocked by:**
02: Hero Section Épuré & Scroll Indicator Cinétique
03: Showcase Projets en Sticky Stacking Cards & Archive
04: Hub d'Onglets Interactif de la Stack Technique
05: Accélération du Boot Screen (~1.2s) & Session Memory

**Status:** closed (completed)

- [x] Vérifier les contrastes texte/fond et boutons selon WCAG AA (≥ 4.5:1)
- [x] Tester et valider le mode `prefers-reduced-motion` (aucun décalage saccadé, cartes lisibles instantanément)
- [x] Vérifier la bonne ergonomie sur mobile (header fixe, burger menu, sticky stack adapté)
- [x] Exécuter `npm run lint` et corriger d'éventuels avertissements
- [x] Exécuter `npm run build` (`tsc -b && vite build`) et vérifier le bundle de production
