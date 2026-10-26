# figma-make-app

React + Vite + Tailwind CSS project, originally generated with Figma Make. It is no longer edited in Figma Make: work happens in this repository and the site is deployed on Vercel. Respond and document in **Spanish**. See `README.md`.

## Development Server

Start it with `pnpm dev` (port `$PORT`, default 8443). `/api/*` is proxied to Astrolabio API (see `vite.config.ts`); set `API_URL=http://localhost:3000` to use a local API.

## Content and API

- The story, world, characters, mechanics and archives come from **Astrolabio API** through `src/api.ts` (`useApi`). The API's database is the source of truth; never hardcode that content.
- `src/content.ts` only holds presentation texts (hero, about, trailer, socials, credits). Anything there about the game must match the database.
- Always call the API with relative paths (`/api/v1/...`): `vercel.json` rewrites them to the API, so no CORS is needed.
- The PWA (manifest and service worker) is configured in `vite.config.ts`; icons are generated with `node scripts/generar-iconos.mjs`.

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/api.ts` - Astrolabio API client: response types, `obtener` and the `useApi` hook
- `src/components/` - `sections.tsx` (hero, about, story, trailer), `universe.tsx` (world, characters, mechanics, archives, footer), `chrome.tsx` (navbar, loader, menu), `ui.tsx` (shared pieces)
- `vercel.json` - Vercel config: Vite framework and the `/api/*` rewrite to Astrolabio API
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react` and `vite-plugin-pwa`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply. Tailwind's Preflight already applies `box-sizing: border-box`, removes default margins, and sets `font: inherit` on form controls, so do not repeat those rules.
