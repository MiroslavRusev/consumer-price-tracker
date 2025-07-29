import { fetchApiData } from '$lib/dataFetcher/dataFetch';
import type { FuelData, FuelRequest, FuelItem, FuelBarChartData, FuelBarData } from '$lib/interfaces';
import { fuelItems, timeRanges } from '$lib/constants';

export const getFuelItems = async (): Promise<FuelItem[]> => {
	return fuelItems;
};

export const getFuelData = async (params: FuelRequest): Promise<FuelData> => {
	const queryString = new URLSearchParams({
		fuelType: params.fuelType,
		date: params.date
	}).toString();

	const data = await fetchApiData({ url: `/api/fuel-prices?${queryString}` });

	// The API returns a single fuel data object, not an object with fuelData property
	// Check if the response has the expected fuel data properties
	if (!data || typeof data !== 'object' || !('fuel' in data) || !('price' in data)) {
		throw new Error('Invalid API response: fuel data not found');
	}

	// Type assertion to treat the response as a FuelData object
	const fuelData = data as unknown as FuelData;
	// Return the single fuel data object as an array to match the expected return type
	return fuelData;
};

export const getFuelBarChartData = async (
	selectedRange: string,
	selectedFuelItems: string[]
): Promise<FuelBarChartData> => {
	if (selectedFuelItems.length === 0) {
		return { labels: [], datasets: [] };
	}

	const range = timeRanges.find((r) => r.id === selectedRange);
	if (!range) {
		return { labels: [], datasets: [] };
	}

	// Calculate the date for the "then" period based on the selected range
	const now = new Date();
	let thenDate: Date;

	switch (range.period) {
		case 'months':
			thenDate = new Date(now.getFullYear(), now.getMonth() - range.length, now.getDate());
			break;
		case 'years':
			thenDate = new Date(now.getFullYear() - range.length, now.getMonth(), now.getDate());
			break;
		default:
			thenDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
	}

	const datasets: FuelBarData[] = [];
	const labels = ['Сега', 'Преди'];

	// Get current and previous prices for each selected fuel
	for (const fuelId of selectedFuelItems) {
		const fuel = fuelItems.find((item) => item.id === fuelId);
		if (!fuel) continue;

		try {
			// Get current price
			const currentData = await getFuelData({
				fuelType: fuelId,
				date: now.toISOString().split('T')[0]
			});

			// Get previous price
			const previousData = await getFuelData({
				fuelType: fuelId,
				date: thenDate.toISOString().split('T')[0]
			});

			datasets.push({
				label: fuel.name,
				data: [currentData.price, previousData.price],
				backgroundColor: [fuel.color, '#b3b3b3'],
				secondBackgroundColor: '#b3b3b3',
				borderColor: fuel.color
			});
		} catch (error) {
			console.error(`Error fetching data for ${fuelId}:`, error);
			// Add dataset with zeros if data fetch fails
			datasets.push({
				label: fuel.name,
				data: [0, 0],
				backgroundColor: [fuel.color, '#b3b3b3'],
				secondBackgroundColor: fuel.color,
				borderColor: fuel.color
			});
		}
	}

	return { labels, datasets };
};
