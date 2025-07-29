import type { UtilityApiResponse } from '$lib/interfaces';
import { periodToLabels } from '$lib/utils/helperMethods';
import { waterPricesAvg } from '$lib/offlineData/waterPricesAvg';

export const processWaterData = (): UtilityApiResponse => {
	// TODO: Add the water prices from the API (when such is available)
	const timePeriods = Object.keys(waterPricesAvg);
	const labels = periodToLabels(timePeriods);
	const priceData: { [key: string]: number[] } = {};
	priceData['water'] = timePeriods.map((period) => {
		return waterPricesAvg[period as keyof typeof waterPricesAvg];
	});

	return { utilityItems: ['water'], labels: labels, priceData: priceData };
};
