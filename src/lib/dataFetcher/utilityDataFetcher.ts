import { utilityItems } from '$lib/constants';
import { fetchApiData } from '$lib/dataFetcher/dataFetch';
import type { UtilityPriceData, ChartData, UtilityApiResponse } from '$lib/interfaces';
import { getSemestrialPointsToShow } from '$lib/utils/datesAndRanges';

// Get chart data using real API data
export const getUtilityChartData = async (
	selectedRange: string,
	selectedUtilityItems: string[]
): Promise<ChartData> => {
	// Calculate how many data points to show based on the range
	// Data points are semestrial (half-year), so we need to adjust calculations
	const dataPointsToShow = getSemestrialPointsToShow(selectedRange);
	if (!dataPointsToShow) {
		return { labels: [], datasets: [] };
	}

	// Fetch data for selected utilities and combine them
	const combinedData: UtilityApiResponse = {
		utilityItems: selectedUtilityItems,
		labels: [],
		priceData: {}
	};

	let labelsSet = false;

	// Fetch data for each selected utility item dynamically
	for (const utilityItem of selectedUtilityItems) {
		if (utilityItem === 'electricity' || utilityItem === 'water') {
			const utilityResponse = (await fetchApiData({
				url: `/api/utility-prices?utilityItem=${utilityItem}`
			})) as UtilityApiResponse;

			// Validate response
			if (!utilityResponse || !utilityResponse.labels || !utilityResponse.labels.length) {
				continue; // Skip this utility if invalid response
			}

			// Set labels from the first valid response
			if (!labelsSet) {
				combinedData.labels = utilityResponse.labels;
				labelsSet = true;
			}

			// Add utility price data
			combinedData.priceData[utilityItem] = utilityResponse.priceData[utilityItem] || [];
		}
	}

	// If no valid data was found
	if (!combinedData.labels.length) {
		return { labels: [], datasets: [] };
	}

	// Get the most recent data points
	const recentLabels = combinedData.labels.slice(-dataPointsToShow);
	const datasets: UtilityPriceData[] = [];

	selectedUtilityItems.forEach((utilityId) => {
		const utility = utilityItems.find((item) => item.id === utilityId);
		const prices = combinedData.priceData[utilityId];

		if (utility && prices && prices.length > 0) {
			// Get the most recent price data
			const recentPrices = prices.slice(-dataPointsToShow);

			datasets.push({
				label: utility.name,
				data: recentPrices,
				backgroundColor: utility.color,
				borderColor: utility.color
			});
		}
	});

	return { labels: recentLabels, datasets };
};
