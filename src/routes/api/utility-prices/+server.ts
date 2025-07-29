import { json } from '@sveltejs/kit';
import { EUROSTAT_API } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import { processEurostatElectricityData } from '$lib/dataProcessing/dataElectricityProcessing';
import { processWaterData } from '$lib/dataProcessing/dataWaterProcessing';
import type { UtilityApiResponse } from '$lib/interfaces';

export const GET: RequestHandler = async ({ url }) => {
	let structuredData: UtilityApiResponse;
	try {
		if (url.searchParams.get('utilityItem') === 'electricity') {
			// The URL is hardcoded because there is no variable for the electricity data
			// A to do for the future is to create a dynamic time_period which is set to 10 years ago
			const apiUrl = `${EUROSTAT_API}/nrg_pc_204/1.0/*.*.*.*.*.*.*` +
				`?c[freq]=S` +
				`&c[product]=6000` +
				`&c[nrg_cons]=KWH2500-4999` +
				`&c[unit]=KWH` +
				`&c[tax]=I_TAX` +
				`&c[currency]=NAC` +
				`&c[geo]=BG` +
				`&c[TIME_PERIOD]=ge:2015-S1` +
				`&compress=false` +
				`&format=json` +
				`&lang=en`;
			const response = await fetch(apiUrl);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const rawData = await response.json();
			// Process the raw data to get the structured data
			structuredData = processEurostatElectricityData(rawData);
		} else if (url.searchParams.get('utilityItem') === 'water') {
			// Process the raw data to get the structured data
			structuredData = processWaterData();
		} else {
			throw new Error('Invalid utility item');
		}
		// Return the structured data as JSON
		return json(structuredData);
	} catch (error) {
		console.error('Error fetching data:', error);
		return json({ error: 'Failed to fetch data' }, { status: 500 });
	}
};
