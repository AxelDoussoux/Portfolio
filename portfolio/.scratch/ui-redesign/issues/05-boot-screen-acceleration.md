# 05: Accélération du Boot Screen (~1.2s) & Session Memory

**What to build:**
Accélérer l'animation du Boot Screen initial pour réduire le délai d'attente à environ 1.2s, intégrer la jauge bicolore Bleu Cobalt & Hyper-Violet, et enregistrer dans `sessionStorage` que l'intro a déjà été jouée afin de ne pas bloquer l'utilisateur lors de ses revisites sur l'accueil pendant la même session.

**Blocked by:**
02: Hero Section Épuré & Scroll Indicator Cinétique

**Status:** closed (completed)

- [x] Ajuster la durée de l'animation de boot à ~1.2s au lieu de 2.5s
- [x] Habiller la jauge de progression avec un dégradé dur / bicolore Bleu & Violet
- [x] Ajouter la vérification et l'écriture dans `sessionStorage` (`portfolio_intro_seen`) pour bypasser l'intro lors des revisites
- [x] Permettre toujours le skip manuel par clic ou touche Échap
