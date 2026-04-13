# AGENTS.md

## Project Overview
This repository is a Vite + React + TypeScript portfolio app.

- Entry point: `src/main.tsx`
- Root app: `src/App.tsx`
- Main portfolio implementation: `src/assets/scripts/portfolio.tsx`
- Global styling: `src/index.css`
- App-level stylesheet: `src/App.css` is currently empty

## Common Commands
Use the package scripts defined in `package.json`:

- `npm install` to install dependencies
- `npm run dev` to start the Vite dev server
- `npm run build` to type-check and build for production
- `npm run lint` to run ESLint
- `npm run preview` to preview a production build locally

## Editing Guidelines
- Keep changes minimal and focused on the requested task.
- Preserve the current portfolio design language unless the user explicitly asks for a redesign.
- Prefer TypeScript and React function components.
- Reuse existing assets and components in `src/assets/scripts/` before adding new abstractions.
- Avoid adding new dependencies unless they are clearly needed.
- If you change visuals, check both desktop and mobile behavior.
- Respect reduced-motion behavior and existing scroll/animation conventions in `src/index.css`.

## Validation
- Prefer `npm run build` as the main sanity check after structural or dependency changes.
- Run `npm run lint` when modifying application logic or React components.
- If VS Code diagnostics look stale after creating a new file, rebuild before assuming there is a real issue.

## Asset Notes
- `public/fonts`, `public/images`, and `public/videos` are the main static asset folders.
- The project uses `react-icons`, `motion`, and `three` already; prefer those before introducing another library.
- For brand icons, note that `simple-icons` works for GitHub and Instagram, but LinkedIn may still need a local fallback icon object.

## Windows / Tooling Notes
- The workspace runs on Windows with PowerShell.
- If `rg` is unavailable in PowerShell, use `Select-String` for text search.
