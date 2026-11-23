---
name: data-source-fix
description: Diagnose and fix a broken external data source — Eurostat (food prices, electricity) or Fuelo (fuel prices). Use when a chart is empty or stuck loading, an /api/* endpoint returns 500, Eurostat returns 400 INVALID_QUERY_DIMENSION_VALUE, or the user says an API changed.
---

# Fix a broken data source

## 1. Find which source and which value is broken

Run `yarn check:data-sources`. It queries every Eurostat food code individually, the electricity dataset, and every Fuelo fuel type, and prints `FAIL` lines with the API's own error message. It never prints the Fuelo key; keep it that way and don't `cat .env`.

If everything passes but the app still fails, the problem is in this repo, not the API. Check the dev server log for the endpoint error (`yarn dev`, then `curl -s localhost:5173/api/food-prices`) and look at `src/lib/dataProcessing/*`.

## 2. Eurostat

The base URL is `EUROSTAT_API` (SDMX 3.0 dissemination API, JSON-stat output). Datasets in use:

| Chart       | Dataset      | Fixed filters                                                                                      | Code                                       |
| ----------- | ------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Food        | `prc_fpmt_m` | `freq=M`, `unit=I25`, `indx=HICP`, `geo=BG`, `coicop18=<codes>`                                    | `src/routes/api/food-prices/+server.ts`    |
| Electricity | `nrg_pc_204` | `freq=S`, `siec=E7000`, `nrg_cons=KWH2500-4999`, `unit=KWH`, `tax=I_TAX`, `currency=EUR`, `geo=BG` | `src/routes/api/utility-prices/+server.ts` |

Typical failures:

- **A product code was renamed or dropped** (`INVALID_QUERY_DIMENSION_VALUE ... COICOP18=CPxxxxx`). Eurostat moved to COICOP 2018 (`coicop18`). Try the parent code by removing trailing digits, e.g. coffee `CP01220` → `CP0122`. Confirm the new code returns values for `geo=BG`, and that it measures the same thing (look at the label in `dimension.coicop18.category.label`). Update **both** `productCodes` and `foodItems` in `src/lib/constants.ts`. If no equivalent exists, remove the product from both lists and say so in the PR.
- **A dimension was renamed** (e.g. `coicop` → `coicop18`). Fetch the dataset with only `geo=BG` and a short `TIME_PERIOD`, and read `id` and `dimension` in the response to get the current dimension names. Update the query and the matching key in `src/lib/dataProcessing/dataProcessing.ts`.
- **The dataset was replaced.** Search the Eurostat data browser for the new code and check its dimensions match before switching.
- **Late data**: the food query asks for months up to two months ago; Eurostat can publish later than that, and missing months come back empty rather than as an error. That's expected and not a bug.

Test single queries quickly with `curl -s "$EUROSTAT_API/prc_fpmt_m/1.0/*.*.*.*.*?c[freq]=M&c[unit]=I25&c[indx]=HICP&c[coicop18]=CP0122&c[geo]=BG&c[TIME_PERIOD]=2026-08&format=json&lang=en"`. The base URL is public, so it's fine to put it in the command; read it with `grep EUROSTAT_API .env.example` if needed.

## 3. Fuelo

- Endpoint: `${FUELO_API_URL}/price?key=${FUELO_API_KEY}&fuel=<id>&date=YYYY-MM-DD`. A good response looks like `{"status":"OK","fuel":"gasoline","price":1.48,"dimension":"€/л","date":"..."}`.
- Fuel ids are the `id`s of `fuelItems` in `src/lib/constants.ts` (`gasoline`, `diesel`, `lpg`, `methane`).
- An auth error or a non-`OK` status probably means the key was revoked or the plan changed. That's for the maintainer to fix (the key lives in `.env` locally and in Vercel). Report it; don't try to work around it.
- If the response shape changed, update `src/routes/api/fuel-prices/+server.ts` and the `FuelData` interface in `src/lib/interfaces.ts`. Keep the BGN→EUR conversion for dates before 2026-01-01.
- `fuel-prices/+server.ts` has no `response.ok` check or try/catch yet. Add them when you touch it (see `.claude/rules/api-and-data.md`).

## 4. Verify and ship

1. `yarn check:data-sources` passes.
2. `yarn run check` and `yarn lint` pass.
3. With `yarn dev` running, the affected chart renders on `/` (use the `ui-checker` agent).
4. If a product was added, removed or renamed, update the lists in `README.md`.
5. Commit as `fix: ...` on a branch and describe the upstream change in the PR (old code → new code, with Eurostat's error message).
