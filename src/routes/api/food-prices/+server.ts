import { json } from '@sveltejs/kit';
import { EUROSTAT_API } from '$env/static/private';
import { productCodes } from '$lib/constants';
import { processEurostatData } from '$lib/dataProcessing/dataProcessing';
import type { RequestHandler } from '@sveltejs/kit';

const generateYearMonthRange = (monthsBack: number): string => {
	const dates: string[] = [];
	const now = new Date();

	for (let i = 0; i < monthsBack; i++) {
		const date = new Date(now.getFullYear(), now.getMonth() - i - 2, 1);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		dates.push(`${year}-${month}`);
	}

	return dates.join(',');
};

export const GET: RequestHandler = async () => {
	try {
		// Get all product codes as comma-separated string
		const allProductCodes = Object.values(productCodes).join(',');

		const apiUrl = `${EUROSTAT_API}/prc_fsc_idx/1.0/*.*.*.*.*` +
			`?c[freq]=M` +
			`&c[unit]=I15` +
			`&c[indx]=HICP` +
			`&c[coicop]=${allProductCodes}` +
			`&c[geo]=BG` +
			`&c[TIME_PERIOD]=${generateYearMonthRange(120)}` +
			`&compress=false` +
			`&format=json` +
			`&lang=en`;
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const rawData = await response.json();
		const structuredData = processEurostatData(rawData);
		return json(structuredData);
	} catch (error) {
		console.error('Error fetching data:', error);
		return json({ error: 'Failed to fetch data' }, { status: 500 });
	}
};
