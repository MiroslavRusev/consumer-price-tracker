import type { ChartData } from '$lib/interfaces';
import { utilityItems } from '$lib/constants';

export const periodToLabels = (timePeriods: string[]): string[] => {
	const labels = timePeriods.map((period) => {
		// Handle semester format (YYYY-S1, YYYY-S2)
		const semesterMatch = period.match(/^(\d{4})-S([12])$/);
		if (semesterMatch) {
			const year = semesterMatch[1];
			const semester = semesterMatch[2];
			// S1 = January, S2 = June
			const month = semester === '1' ? '01' : '06';
			const date = new Date(`${year}-${month}-01`);
			return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
		} else {
			throw new Error(`Invalid date format: ${period}`);
		}
	});
	return labels;
};

export function calculateInflationRate(data: ChartData): number {
	const inflationRates = data.datasets.map((dataset) => {
		const values = dataset.data;
		return (values[values.length - 1] - values[0]) / values[0];
	});

	// Calculate the average inflation rate
	const averageInflationRate = inflationRates.reduce((sum, newRate) => sum + newRate, 0) / inflationRates.length;

	// Return the average inflation rate as raw number
	return averageInflationRate;
}

export function returnUtilityPrice(data: ChartData) {
	return data.datasets.map((dataset) => {
		const values = dataset.data;
		const id = utilityItems.find((item) => item.name === dataset.label)?.id;
		return { currentPrice: values[values.length - 1], historicalPrice: values[0], id };
	});
}

export function handleSelectedProductsAndPeriod(data: ChartData) {
	const period = data.labels.length;
	let periodString = '';
	if (period < 12) {
		periodString = data.labels.length + ' месеца';
	} else if (period === 12) {
		periodString = '1 годинa';
	} else {
		periodString = Math.floor(data.labels.length / 12) + ' години';
	}

	const products = data.datasets;
	let productsString = '';
	productsString = products.map((product) => product.label).join(', ');
	return { periodString, productsString };
}

export function getSelectedUtilityItemsString(selectedUtilityIds: string[]) {
	return utilityItems
		.filter((item) => selectedUtilityIds.includes(item.id))
		.map((item) => item.name)
		.join(', ');
}
