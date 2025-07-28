import { timeRanges, utilityItems } from '$lib/constants';
import { fetchApiData } from '$lib/dataFetch';
import type { UtilityPriceData, ChartData, UtilityApiResponse } from '$lib/interfaces';

// Get chart data using real API data
export const getUtilityChartData = async (
	selectedRange: string,
	selectedUtilityItems: string[]
): Promise<ChartData> => {
	// Only show utility data for ranges above 1 year
	const range = timeRanges.find((r) => r.id === selectedRange);
	if (!range) {
		return { labels: [], datasets: [] };
	}

	// Calculate how many data points to show based on the range
	// Data points are semestrial (half-year), so we need to adjust calculations
	let dataPointsToShow: number;
	switch (range.period) {
		case 'months':
			// For 3 months and 6 months, show 1 data point to avoid empty values
			if (range.length <= 6) {
				dataPointsToShow = 1;
			} else if (range.length === 12) {
				dataPointsToShow = 2;
			} else {
				throw new Error('Invalid range: ' + range.length);
			}
			break;
		case 'years':
			// For years, multiply by 2 since we have 2 data points per year
			dataPointsToShow = range.length * 2;
			break;
		default:
			dataPointsToShow = range.length;
	}

	// Check what utilities are selected

	if (selectedUtilityItems.length === 0) {
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
