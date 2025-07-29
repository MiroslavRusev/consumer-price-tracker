import { json } from '@sveltejs/kit';
import { BASE_API_URL_ELE } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import { processEurostatElectricityData } from '$lib/dataProcessing/dataElectricityProcessing';
import { processWaterData } from '$lib/dataProcessing/dataWaterProcessing';
import type { UtilityApiResponse } from '$lib/interfaces';

export const GET: RequestHandler = async ({ url }) => {
	let structuredData: UtilityApiResponse;
	try {
		if (url.searchParams.get('utilityItem') === 'electricity') {
			// Get all product codes as comma-separated string
			const apiUrl = `${BASE_API_URL_ELE}`;
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
