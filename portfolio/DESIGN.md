# Design System — Portfolio Axel Doussoux

## Theme & Art Direction

- **Style** : Light Neo-Brutalism & Blueprint Wireframe.
- **Principe fondamental** : Form Follows Function. Éléments tranchants (0 border-radius), géométrie orthogonale rigoureuse, bordures noires continues et textures architecturales en filigrane.
- **Ambiance lumineuse** : Fond clair minéral (`#F4F5F8`) adouci par une trame millimétrée subtile et un grain tactile doux. Des lueurs d'ambiance diffuses (Cobalt, Cyan et Hyper-Violet) ajoutent de la profondeur sans altérer la lisibilité.

## Color Tokens

```css
:root {
  /* Surfaces & Fonds minéraux */
  --bg-void: #f4f5f8;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #eef2f7;
  --bg-surface-hover: #e2e8f0;

  /* Lignes & Bordures d'ingénierie */
  --border-wire: #000000;
  --border-wire-light: #cbd5e1;
  --border-wire-strong: #000000;

  /* Duo Chromatique Électrique */
  --neon-blue: #0055ff;
  --neon-blue-light: #e0ebff;
  --neon-purple: #7c3aed;
  --neon-purple-light: #f3e8ff;
  --neon-purple-dim: #6d28d9;
  --neon-cyan: #00b4d8;
  --neon-pink: #ff3366;
  --neon-yellow: #ffe500;

  /* Typographie & Encre */
  --text-primary: #0a0a0e;
  --text-secondary: #475569;
  --text-dim: #64748b;
}
```

## Typography

- **Display & Titres** : `'Syne', sans-serif` (poids 800-900, majuscules percutantes, letter-spacing -0.02em, hauteur de ligne compacte ~0.95 à 1.08).
- **Labels, Métadonnées & Code** : `'Space Mono', monospace` (poids 700, majuscules, tracking étendu, balises et badges système).
- **Corps de texte (Prose)** : `'Space Grotesk', sans-serif` (poids 400-500, excellente lisibilité technique, longueur de ligne plafonnée à 65-75 caractères).

## Ombres & Profondeur (Hard Offset Shadows)

```css
.brutal-shadow-sm { box-shadow: 2px 2px 0px #000000; }
.brutal-shadow    { box-shadow: 4px 4px 0px #000000; }
.brutal-shadow-lg { box-shadow: 6px 6px 0px #000000; }
.brutal-shadow-blue   { box-shadow: 4px 4px 0px var(--neon-blue); }
.brutal-shadow-purple { box-shadow: 4px 4px 0px var(--neon-purple); }
```

## Composants Clés

1. **Parcours scrollytelling** : cinq chapitres dans l'ordre Accueil → Projets → Parcours → Stack → Contact. Sur les écrans ≥ 1024×620 sans `prefers-reduced-motion` (`useScrollytelling`), les chapitres Accueil et Projets sont épinglés et pilotés par le scroll ; ailleurs, le même contenu s'affiche en flux vertical simple.
   - **Prologue** (`heroPrologue.tsx`) : l'identité recule, puis un panneau Cobalt plein écran remonte en `clip-path` et le manifeste s'allume mot à mot.
   - **Reel de projets** (`projectReel.tsx`) : piste horizontale épinglée (1 px de scroll vertical = 1 px de déplacement latéral), compteur `01 / 04`, barre de progression, parallaxe des captures. Le focus clavier fait défiler jusqu'au projet visé.
   - **Frise Parcours** (`journeyTimeline.tsx`) : formations et expériences triées par date, rail qui se remplit au scroll, année active géante dans une colonne sticky.
   - **Finale Contact** : chapitre plein écran sur fond encre `#0A0A0E`, qui répond au panneau Cobalt du prologue.
2. **Brutal Buttons** : Boutons tactiles avec déplacement physique immédiat au clic (`translate(2px, 2px)` et annihilation d'ombre) et inversion de contraste au survol.
3. **Hub d'Onglets Technique** : Barre de sélection instantanée à puces filtrantes réorganisant les compétences avec transition fluide de disposition.
4. **Scroll Indicator Cinétique** : Rail d'amorce de défilement guidant l'utilisateur de manière intuitive vers les projets.

## Moteur de Mouvement & Accessibilité

- **Motion v14** : Scroll-driven orchestration, Sticky stacks, transitions d'onglets `AnimatePresence`.
- **Anime.js v4** : Interactions tactiles (pressed buttons physics), reveals typographiques SplitText.
- **Accessibilité** : `@media (prefers-reduced-motion: reduce)` désactive instantanément toutes les translations, échelles et animations en boucle. Le contenu reste 100% visible et interactif sans latence.
