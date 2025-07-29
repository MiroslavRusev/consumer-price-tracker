import { timeRanges } from '$lib/constants';

export function getDateFromRange(rangeId: string) {
	const range = timeRanges.find((range) => range.id === rangeId);
	if (!range) throw new Error(`Range ${rangeId} not found`);

	const now = new Date();
	if (range.period === 'months') {
		return new Date(now.getFullYear(), now.getMonth() - range.length, now.getDate());
	}
	if (range.period === 'years') {
		return new Date(now.getFullYear() - range.length, now.getMonth(), now.getDate());
	}
}
