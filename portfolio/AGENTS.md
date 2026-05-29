# AGENTS.md

## Project Overview
Vite + React + TypeScript portfolio with 3D Galaxy background.

- Entry: `src/main.tsx`
- Root: `src/App.tsx`
- Main: `src/assets/scripts/portfolio.tsx`
- Data: `src/assets/scripts/portfolioData.tsx`
- Styles: `src/index.css`
- Components: `src/assets/scripts/` (projectCard, projectDetailPage, galaxyBackground, etc.)

## Commands
- `npm run dev` — dev server
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint
- `npm run preview` — preview build

## Architecture
- Intro animation system: `introPhase` state controls transitions ('center' → 'expand' → 'move' → 'exit')
- GalaxyBackground: Three.js animated spiral galaxy with mobile performance optimization
- Projects: defined in `portfolioData.tsx`, rendered via `ProjectCard` and `ProjectDetailPage`
- Color palette: CSS variables in `index.css` (test palette active by default)
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
