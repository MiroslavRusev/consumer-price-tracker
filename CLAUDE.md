# Consumer Price Tracker

SvelteKit app showing Bulgarian consumer price trends (food, fuel, utilities), a purchasing-power calculator and a mortgage calculator. Deployed to Vercel automatically from GitHub; there is no other environment.

## Stack

- SvelteKit 3, Svelte 5, Vite 8, TypeScript 6 (not 7 — Kit, `svelte-check` and `typescript-eslint` don't support it yet)
- Tailwind CSS 4 via `@tailwindcss/vite` (no `tailwind.config.js`, no PostCSS config); styles in `src/styles/input.css`
- Chart.js through `svelte5-chartjs`
- Yarn 1, Node 24 (Kit 3 needs Node ≥ 22.17)

## Commands

- `yarn dev` — dev server on http://localhost:5173
- `yarn run check` — svelte-kit sync + svelte-check. **Always `yarn run check`, never `yarn check`**: Yarn 1 runs its own dependency checker for `yarn check` and never reaches the script.
- `yarn lint` — Prettier check + ESLint
- `yarn format` — Prettier write
- `yarn build` — production build
- `yarn check:data-sources` — calls Eurostat and Fuelo directly, one check per product code / fuel type; exits non-zero if any source is broken

There are no automated tests yet. CI (`.github/workflows/test.yml`) runs `yarn lint` on PRs.

## Definition of done

`yarn run check` and `yarn lint` pass with no errors. The maintainer runs `yarn build` and tests the UI manually; if you changed anything visible or any data path, also run the build and, when a browser is available, load the affected page (see the `ui-checker` agent).

## Layout

- `src/routes/api/*/+server.ts` — server endpoints that call external APIs (the only place secrets are used)
- `src/lib/dataFetcher/` — client-side fetchers for those endpoints (with a 60-min in-memory cache in `dataFetch.ts`)
- `src/lib/dataProcessing/` — turns raw Eurostat JSON-stat into chart data; `offlineData/` holds hard-coded water prices
- `src/lib/dataManagement/dataManager.ts`, `src/lib/stores.ts` — app state (Svelte stores)
- `src/lib/constants.ts` — product codes, fuel/utility items, time ranges, defaults
- `src/components/{charts,form,main,mortgage,structural}/` — UI; `src/routes/{+page,info,mortgage}` — pages
- `src/env.ts` — declares environment variables (Kit 3 `defineEnvVars`)

## Data sources

- **Eurostat** food prices: dataset `prc_fpmt_m`, HICP index 2015=100, geo `BG`, filtered by COICOP 2018 codes. All food codes go in **one** request, so a single code Eurostat renames or drops returns HTTP 400 for the whole request and the food chart never loads.
- **Eurostat** electricity: dataset `nrg_pc_204`, half-yearly, household band 2500–4999 kWh, EUR incl. taxes.
- **Fuelo** fuel prices: `FUELO_API_URL` + `/price?key=…&fuel=…&date=…`. Prices before 2026-01-01 are in BGN and converted to EUR in the endpoint (rate 1.95583).
- Food product codes appear **twice** in `constants.ts` (`productCodes` and `foodItems`) — change both.

When a data source breaks, use the `data-source-fix` skill.

## Conventions

- Commits and PR titles use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`. Work on a feature branch and open a PR into `main`; never push to `main`.
- English for all code, identifiers, comments and commit messages. Bulgarian only for user-facing text in markup.
- New and touched code uses Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`) and `$app/state`. Most components still use Svelte 4 syntax (`export let`, `$:`); migrate a component only when you are already changing it.
- Prettier: tabs, single quotes, no trailing commas, width 120 (150 for `.svelte`).

## SvelteKit 3 gotchas

- No `svelte.config.js`: Kit and `vite-plugin-svelte` options go in `sveltekit({...})` in `vite.config.ts`.
- `$lib` is kept via a deprecated `alias` in `vite.config.ts` (it prints a `config_option_deprecated_alias` warning — expected). The move to `#lib` subpath imports is planned separately; don't mix `#lib` into unrelated changes.
- Env vars: declare in `src/env.ts`, import from `$app/env/private` (server) or `$app/env/public`. Not `$env/static/*`.
- `$app/env` replaces `$app/environment`; `$app/stores` is removed — use `$app/state`.
- `@vercel/analytics/sveltekit` imports `$app/stores` and crashes on Kit 3, so `src/routes/+layout.svelte` uses the core `inject()` + `pageview()` instead. Don't switch back until Vercel ships Kit 3 support.

## Secrets

This repo is shared with the team. Never read, print, commit or paste the contents of `.env`. Only `.env.example` (placeholders) is committed; when adding a variable, add a placeholder there and declare it in `src/env.ts`. The Fuelo key must stay in server code (`src/routes/api/**`).
