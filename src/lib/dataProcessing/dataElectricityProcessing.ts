import type { UtilityApiResponse, EurostatResponse } from '$lib/interfaces';
import { periodToLabels } from '$lib/utils/helperMethods';

export const processEurostatElectricityData = (rawData: unknown): UtilityApiResponse => {
	const dataset = rawData as EurostatResponse;

	if (!dataset?.dimension?.time?.category?.index || !dataset?.value) {
		return { utilityItems: [], labels: [], priceData: {} };
	}

	const { dimension, value } = dataset as EurostatResponse;

	const timeLabels = dimension.time!.category.index;
	const timePeriods = Object.keys(timeLabels).sort();

	const labels = periodToLabels(timePeriods);

	const priceData: { [key: string]: number[] } = {};

	// This code creates an array of electricity prices for each time period.
	// For each period in timePeriods, it finds the index of that period,
	// retrieves the corresponding value from the Eurostat dataset's value array,
	// parses it as a float, and adds it to the array.
	// The resulting array is assigned to the 'electricity' key in priceData.
	priceData['electricity'] = timePeriods.map((period) => {
		const valueIndex = timePeriods.indexOf(period);
		return parseFloat(value[valueIndex]);
	});

	return { utilityItems: ['electricity'], labels: labels, priceData: priceData };
};
