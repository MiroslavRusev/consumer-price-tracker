import { timeRanges } from '$lib/constants';
import { fetchApiData } from '$lib/dataFetcher/dataFetch';
import type { FoodPriceData, ChartData, FoodItem } from '$lib/interfaces';

// Get available food items from API
export const getFoodItems = async (): Promise<FoodItem[]> => {
	const data = await fetchApiData({ url: '/api/food-prices' });
	// Validate that the response is from the correct type
	if ('foodItems' in data) {
		return data.foodItems;
	}
	throw new Error('Invalid API response: foodItems not found');
};

// Get chart data using real API data
export const getChartData = async (selectedRange: string, selectedFoods: string[]): Promise<ChartData> => {
	// Filter labels based on selected range
	const range = timeRanges.find((r) => r.id === selectedRange);
	if (!range) {
		return { labels: [], datasets: [] };
	}
	const data = await fetchApiData({ url: '/api/food-prices' });
	// Validate that the response is from the correct type
	if (!('foodItems' in data)) {
		throw new Error('Invalid API response: foodItems not found');
	}

	if (!data.foodItems.length || !data.labels.length) {
		return { labels: [], datasets: [] };
	}

	// Calculate how many data points to show based on the range
	let dataPointsToShow: number;
	switch (range.period) {
		case 'months':
			dataPointsToShow = Math.min(range.length, data.labels.length);
			break;
		case 'years':
			dataPointsToShow = Math.min(range.length * 12, data.labels.length);
			break;
		default:
			dataPointsToShow = data.labels.length;
	}

	// Get the most recent data points
	const recentLabels = data.labels.slice(-dataPointsToShow);
	const datasets: FoodPriceData[] = [];

	selectedFoods.forEach((foodId) => {
		const food = data.foodItems.find((f) => f.id === foodId);
		const prices = data.priceData[foodId];
		if (food && prices) {
			// Get the most recent price data
			const recentPrices = prices.slice(-dataPointsToShow);

			datasets.push({
				label: food.name,
				data: recentPrices,
				backgroundColor: food.color,
				borderColor: food.color
			});
		}
	});

	return { labels: recentLabels, datasets };
};
