/* eslint-disable no-console -- CLI script, prints a report */
// Checks that every external data source the app depends on still answers with usable data.
// Run with: yarn check:data-sources   (reads .env via --env-file; never prints secrets)
//
// Each Eurostat food code is queried on its own so a single renamed/removed code is easy to spot
// (the app sends them all in one request, so one bad code breaks the whole food chart).

import { productCodes, fuelItems } from '../src/lib/constants.ts';

const { EUROSTAT_API, FUELO_API_URL, FUELO_API_KEY } = process.env;

const results = [];
const record = (source, name, ok, detail) => results.push({ source, name, ok, detail });

const missing = ['EUROSTAT_API', 'FUELO_API_URL', 'FUELO_API_KEY'].filter((key) => !process.env[key]);
if (missing.length) {
	console.error(`Missing env vars: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`);
	process.exit(1);
}

const recentMonths = (count) => {
	const months = [];
	const now = new Date();
	for (let i = 2; i < count + 2; i++) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
	}
	return months.join(',');
};

const eurostatError = async (response) => {
	const text = await response.text();
	try {
		return JSON.parse(text).error?.[0]?.label ?? text.slice(0, 200);
	} catch {
		return text.slice(0, 200);
	}
};

// Eurostat food prices (prc_fpmt_m), one request per COICOP code — same query shape as src/routes/api/food-prices
for (const [name, code] of Object.entries(productCodes)) {
	const url =
		`${EUROSTAT_API}/prc_fpmt_m/1.0/*.*.*.*.*?c[freq]=M&c[unit]=I25&c[indx]=HICP` +
		`&c[coicop18]=${code}&c[geo]=BG&c[TIME_PERIOD]=${recentMonths(6)}&compress=false&format=json&lang=en`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			record(
				'eurostat-food',
				`${name} (${code})`,
				false,
				`HTTP ${response.status}: ${await eurostatError(response)}`
			);
			continue;
		}
		const data = await response.json();
		const values = Object.keys(data.value ?? {}).length;
		record(
			'eurostat-food',
			`${name} (${code})`,
			values > 0,
			values > 0 ? `${values} data points` : 'no values returned'
		);
	} catch (error) {
		record('eurostat-food', `${name} (${code})`, false, String(error));
	}
}

// Eurostat electricity (nrg_pc_204) — same query as src/routes/api/utility-prices
{
	const url =
		`${EUROSTAT_API}/nrg_pc_204/1.0/*.*.*.*.*.*.*?c[freq]=S&c[siec]=E7000&c[nrg_cons]=KWH2500-4999` +
		`&c[unit]=KWH&c[tax]=I_TAX&c[currency]=EUR&c[geo]=BG&c[TIME_PERIOD]=ge:2015-S1&compress=false&format=json&lang=en`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			record(
				'eurostat-electricity',
				'electricity',
				false,
				`HTTP ${response.status}: ${await eurostatError(response)}`
			);
		} else {
			const data = await response.json();
			const periods = Object.keys(data.dimension?.time?.category?.index ?? {});
			record(
				'eurostat-electricity',
				'electricity',
				periods.length > 0,
				periods.length ? `${periods.length} periods, latest ${periods.sort().at(-1)}` : 'no time periods'
			);
		}
	} catch (error) {
		record('eurostat-electricity', 'electricity', false, String(error));
	}
}

// Fuelo prices — same URL shape as src/routes/api/fuel-prices (the key is never printed)
const today = new Date().toISOString().split('T')[0];
for (const fuel of fuelItems) {
	const url = `${FUELO_API_URL}/price?key=${FUELO_API_KEY}&fuel=${fuel.id}&date=${today}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			record('fuelo', fuel.id, false, `HTTP ${response.status}`);
			continue;
		}
		const data = await response.json();
		const ok = data.status === 'OK' && typeof data.price === 'number';
		record(
			'fuelo',
			fuel.id,
			ok,
			ok
				? `${data.price} ${data.dimension ?? ''}`.trim()
				: `unexpected response: ${JSON.stringify(data).slice(0, 150)}`
		);
	} catch (error) {
		record('fuelo', fuel.id, false, String(error));
	}
}

for (const r of results) {
	console.log(`${r.ok ? 'OK  ' : 'FAIL'}  ${r.source.padEnd(20)} ${r.name.padEnd(24)} ${r.detail}`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
