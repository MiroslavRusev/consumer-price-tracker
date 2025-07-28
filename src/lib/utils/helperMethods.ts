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
