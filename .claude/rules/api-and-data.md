---
paths:
    - 'src/routes/api/**'
    - 'src/lib/dataFetcher/**'
    - 'src/lib/dataProcessing/**'
    - 'src/lib/offlineData/**'
    - 'src/lib/constants.ts'
    - 'src/env.ts'
---

# API endpoints and data pipeline

- External APIs (Eurostat, Fuelo) are called **only** from `src/routes/api/**/+server.ts`. Client code goes through `src/lib/dataFetcher/*` → `/api/...`, never straight to an external host.
- Secrets come from `$app/env/private` and must never reach the client or a response body. Don't log full external URLs — the Fuelo URL contains the API key.
- A new env var needs three things: a declaration in `src/env.ts`, a placeholder in `.env.example`, and the variable set in Vercel by the maintainer (say so in the PR description).
- Check `response.ok` before parsing, and on failure return `json({ error: '...' }, { status: 500 })` with the real error logged server-side. `fuel-prices/+server.ts` doesn't do this yet — fix it if you touch that file.
- Remember the client-side fallback: `dataFetch.ts` swallows endpoint errors and returns empty data, so a broken source shows up as an empty or forever-loading chart, not a console crash. When debugging, check the dev server log, not just the browser.
- Eurostat responses are JSON-stat: values sit in a flat `value` object indexed by dimension positions. Read dimension order from `id`/`size`; don't assume it.
- Food product codes live in both `productCodes` and `foodItems` in `constants.ts`. Keep them in sync.
- After changing a query, product code or fuel type, run `yarn check:data-sources` and confirm the endpoint in `yarn dev` (`curl http://localhost:5173/api/<name>`).
- Currency: everything shown is EUR. Fuelo prices dated before 2026-01-01 are BGN and divided by 1.95583 (`eurConversionRate` in `constants.ts`).
