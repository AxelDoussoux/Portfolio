# 01: Intégration des Tokens Hyper-Violet & Ambiance Blueprint

**What to build:**
Déclarer et intégrer l'ensemble des tokens de design Hyper-Violet (`--neon-purple: #7C3AED`, `--neon-purple-light: #F3E8FF`, `.brutal-shadow-purple`, `.brutal-btn-purple`) dans `src/index.css` et enrichir `src/assets/scripts/background.tsx` d'un troisième orbe d'ambiance violet diffus. Permet au duo chromatique Cobalt & Violet de fonctionner de manière cohérente à travers toute l'application.

**Blocked by:**
None (can start immediately)

**Status:** closed (completed)

- [x] Déclarer `--neon-purple`, `--neon-purple-light` et `--neon-purple-dim` dans `:root` (`src/index.css`)
- [x] Ajouter les classes utilitaires néo-brutalistes `.brutal-shadow-purple`, `.brutal-btn-purple` et `.brutal-card-purple` avec transitions tactiles
- [x] Ajouter un troisième orbe d'ambiance violet profond avec animation GPU-composited lente dans `src/assets/scripts/background.tsx`
- [x] Vérifier que `npm run build` compile sans erreur
