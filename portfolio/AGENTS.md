# AGENTS.md

## Project Overview
Vite 8 + React 19 + TypeScript portfolio with tactile blueprint wireframe background and Anime.js animations.

- Repo root is the parent dir `Portfolio S6`; the entire app lives in this `portfolio/` subfolder — run all commands here.
- Entry: `src/main.tsx`
- Root: `src/App.tsx`
- Main: `src/assets/scripts/portfolio.tsx`
- Data: `src/assets/scripts/portfolioData.tsx`
- Styles: `src/index.css`
- Components: `src/assets/scripts/` (heroPrologue, projectReel, journeyTimeline, skillsHub, projectDetailPage, background, introCurtain, etc.)

## Commands
- `npm run dev` — dev server
- `npm run build` — `tsc -b && vite build` (typecheck + build; no test suite exists, this is the verification)
- `npm run lint` — ESLint
- `npm run preview` — preview build

## Architecture
- Intro sequence: boot sequence and IntroCurtain transitions
- Background: Tactile blueprint wireframe grid with GPU-composited ambient glow (Anime.js driven, respects prefers-reduced-motion)
- Animations: `animejs` (v4) used for transitions, tactile button physics, counters, split/typewriter text and reveals
- Journey: scrollytelling chapters Hero → Projects → Parcours → Stack → Contact; pinned only when `useScrollytelling()` is true (≥1024×620, motion allowed), plain vertical flow otherwise
- Projects: defined in `portfolioData.tsx`, rendered via `ProjectReel` (featured) / `ProjectCard` (others) and `ProjectDetailPage`
- Color palette: CSS variables in `index.css` (Light Neo-Brutalism tokens)
- Mobile: burger menu, scroll progress bar, back-to-top button

## CSS Fixes Applied
- Mobile overflow fix: `html { overflow-x: hidden }` + `body { overflow-x: hidden }`
- Tailwind v4: CSS-first config, no tailwind.config.js

## Assets
- Logo: `public/images/logo.svg` (A with gradient)
- Images: `public/images/` (keep clean, verify usage before adding)
- Videos: `public/videos/`
- Fonts: Google Fonts (loaded via CSS)

## Windows
- PowerShell environment
- Search: `Select-String` or `grep` tool

## Design Context
- Register: Brand (Portfolio)
- Philosophy: Light Neo-Brutalism + Blueprint Grid + Electric Cobalt (`#0055FF`) & Hyper-Violet (`#7C3AED`) duo palette
- Core Specs: see [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md), [GLOSSARY.md](GLOSSARY.md) and [docs/adr/](docs/adr/)

