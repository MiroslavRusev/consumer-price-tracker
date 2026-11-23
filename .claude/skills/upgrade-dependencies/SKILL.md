---
name: upgrade-dependencies
description: Upgrade this project's npm packages to their latest compatible versions and fix whatever breaks (SvelteKit, Svelte, Vite, Tailwind, TypeScript, ESLint, Chart.js). Use when asked to update, bump or upgrade packages or dependencies.
---

# Upgrade dependencies

Goal: every package on the newest version that its peers accept, `yarn run check` and `yarn lint` clean, `yarn build` passing, and the app working in `yarn dev`.

## 1. Start clean

- `git status` must be clean. Create a branch: `git checkout -b chore/deps-upgrade-<yyyy-mm>`.
- Note the current versions: `node -p "const p=require('./package.json');JSON.stringify({...p.dependencies,...p.devDependencies},null,1)"`.

## 2. Find latest versions and check peers before bumping

For each package run `npm view <pkg> version`, then for each candidate check `npm view <pkg>@<version> peerDependencies engines --json`. **Don't take "latest" blindly** — a newer major is only usable when the packages that depend on it accept it. Known constraints (re-check each time; they change):

- `typescript`: limited by `@sveltejs/kit`, `svelte-check` and `typescript-eslint` peer ranges. Use the highest version all three accept.
- `@vercel/analytics`: its `@sveltejs/kit` peer range can lag behind; a mismatch is only a warning because `+layout.svelte` uses the framework-agnostic `inject()`/`pageview()`.
- `@tailwindcss/vite`, `@tailwindcss/forms` and `tailwindcss` must share a major (and `@tailwindcss/vite` must match `tailwindcss` exactly in minor).
- `@sveltejs/vite-plugin-svelte` must satisfy Kit's peer range; `vite` must satisfy both.
- Kit's `engines.node` must match the Node on Vercel (project settings) and in CI (`.github/workflows/test.yml`).

Edit `package.json` with `^<version>` ranges. Leave `resolutions` alone unless a resolution now conflicts with a requested range (yarn prints `Resolution field ... is incompatible`); in that case raise it and say so.

## 3. Majors: read the migration notes first

For each **major** bump, find the official migration guide or changelog (`npm view <pkg> repository.url`, then the CHANGELOG / docs) and list what applies to this codebase **before** installing. Prefer official codemods when they exist (`npx sv migrate <name>`, `npx @tailwindcss/upgrade`). Those tools need a clean git tree, so commit the `package.json` bump first.

Also grep `node_modules/<pkg>` for removed modules the error messages name. Kit 3 was found this way: `src/messages/*errors*.js` in `@sveltejs/kit` lists every removed API with its replacement.

## 4. Install and verify

1. `yarn install` (the user may prefer to run this themselves; ask once).
2. `yarn run check`. **Not** `yarn check`, which is Yarn's built-in integrity check.
3. `yarn lint` (and `yarn format` for anything Prettier flags in files you changed).
4. `yarn build`.
5. `yarn check:data-sources`, to confirm the APIs still work, which is independent of packages but cheap to check.
6. Start `yarn dev` and load `/`, `/mortgage` and `/info`. Watch the browser console **and** the dev server log. Library code can still break at runtime even when it type-checks (e.g. a dependency importing a module Kit removed), so the page has to actually render with all three charts. The `ui-checker` agent does this.

Also scan the packages' own source for imports the new framework removed, because type checks don't cover `node_modules`:
`grep -rlF '$app/stores' node_modules/@vercel node_modules/svelte5-chartjs` (adapt the pattern to whatever was removed).

## 5. Commit and report

- Commit in logical steps: the `chore:` version bump, then `fix:` commits for each migration.
- In the summary, list each major bump with what changed, each package held back and why (peer range), and anything not verified.
