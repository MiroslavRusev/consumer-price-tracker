import { timeRanges } from '$lib/constants';

// Return the range object from the rangeId
function getRange(rangeId: string): { id: string, period: string, length: number } | null {
	const range = timeRanges.find((range) => range.id === rangeId);
	if (!range) return null;
	return range;
}

// Get the before date based on range length and period
export function getDateFromRange(rangeId: string): Date | null {
	const range = getRange(rangeId);
	if (!range) return null;

	const now = new Date();
	switch (range.period) {
        case 'months':
            return new Date(now.getFullYear(), now.getMonth() - range.length, now.getDate());
        case 'years':
            return new Date(now.getFullYear() - range.length, now.getMonth(), now.getDate());
        default:
            // Fallback to 1 year ago to avoid errors
            return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
}

// Get the number of data points to show on monthly chart, use dataPoints as fallback
export function getMonthlyPointsToShow (rangeId: string, dataPoints: number): number | null { 
	const range = getRange(rangeId);
	if (!range) return null;

	let dataPointsToShow: number;
	switch (range.period) {
		case 'months':
			dataPointsToShow = Math.min(range.length, dataPoints);
			break;
		case 'years':
			dataPointsToShow = Math.min(range.length * 12, dataPoints);
			break;
		default:
			dataPointsToShow = dataPoints;
	}
	return dataPointsToShow;
}

// Get the number of data points to show on semestrial chart
export function getSemestrialPointsToShow (rangeId: string): number | null { 
	const range = getRange(rangeId);
	if (!range) return null;

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
	return dataPointsToShow;
}
