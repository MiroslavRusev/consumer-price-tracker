import { foodItems } from '$lib/constants';
import type { FoodApiResponse, EurostatResponse } from '$lib/interfaces';

// Process Eurostat data into structured format
export const processEurostatData = (rawData: unknown): FoodApiResponse => {
	const dataset = rawData as EurostatResponse;
	// Check if the data from API is valid
	if (!dataset?.dimension?.time?.category?.index || !dataset?.dimension?.coicop?.category?.index || !dataset?.value) {
		return { foodItems: [], labels: [], priceData: {} };
	}

	const { dimension, value } = dataset as EurostatResponse;
	// Get list of time labels from API
	const timeLabels = dimension.time!.category.index;
	// Get list of coicop categories from API
	const coicopCategories = dimension.coicop!.category.label;
	const coicopIndex = dimension.coicop!.category.index;
	// Create time labels array
	const timePeriods = Object.keys(timeLabels).sort();

	const labels = timePeriods.map((period) => {
		const date = new Date(period);
		return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
	});
	// Process price data for each food item
	const priceData: { [key: string]: number[] } = {};

	foodItems.forEach((food) => {
		const foodCode = food.code;
		const foodIndex = coicopCategories[foodCode];

		if (foodIndex !== undefined) {
			const prices: number[] = [];

			timePeriods.forEach((period, timeIndex) => {
				// Calculate the index in the value array
				// coicop index is an object structured like this:
				// {
				//     "CP01113": 0,
				//     "CP01122": 1,
				//     ...
				// }
				// Timeperiods length is the number of months of data per item (it's months because the API is monthly)
				const valueIndex = coicopIndex[foodCode] * timePeriods.length + timeIndex;
				const price = value[valueIndex];

				if (price !== undefined && price !== null) {
					prices.push(parseFloat(price));
				} else {
					prices.push(0); // Handle missing data
				}
			});

			priceData[food.id] = prices;
		}
	});

	return {
		foodItems: foodItems.map((item) => ({
			id: item.id,
			name: item.name,
			color: item.color
		})),
		labels,
		priceData
	};
};
