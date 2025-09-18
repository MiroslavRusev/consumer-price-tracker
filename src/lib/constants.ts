export const productCodes = {
	bread: 'CP01113',
	pork: 'CP01122',
	poultry: 'CP01124',
	milk: 'CP01141',
	eggs: 'CP01147',
	oil: 'CP0115',
	butter: 'CP01151',
	potatoes: 'CP01174',
	sugar: 'CP01181',
	fish: 'CP0113',
	fruit: 'CP0116',
	vegetables: 'CP0117',
	coffee: 'CP0121'
};

// Define the food items with their Eurostat codes and colors
export const foodItems = [
	{ id: 'bread', name: 'Хляб', code: 'CP01113', color: '#D4A574' },
	{ id: 'pork', name: 'Свинско месо', code: 'CP01122', color: '#8B0000' },
	{ id: 'poultry', name: 'Птиче месо', code: 'CP01124', color: '#FFB6C1' },
	{ id: 'milk', name: 'Мляко', code: 'CP01141', color: '#3371FF' },
	{ id: 'eggs', name: 'Яйца', code: 'CP01147', color: '#FFFACD' },
	{ id: 'oil', name: 'Олио', code: 'CP0115', color: '#FFE66D' },
	{ id: 'butter', name: 'Масло', code: 'CP01151', color: '#FFD700' },
	{ id: 'potatoes', name: 'Картофи', code: 'CP01174', color: '#33FF5E' },
	{ id: 'sugar', name: 'Захар', code: 'CP01181', color: '#FF8E53' },
	{ id: 'fish', name: 'Риба', code: 'CP0113', color: '#F54927' },
	{ id: 'fruit', name: 'Плодове', code: 'CP0116', color: '#E4F527' },
	{ id: 'vegetables', name: 'Зеленчуци', code: 'CP0117', color: '#27E4F5' },
	{ id: 'coffee', name: 'Кафе', code: 'CP0121', color: '#613927' }
];

export const utilityItems = [
	{ id: 'electricity', name: 'Електричество', color: '#3371FF' },
	{ id: 'water', name: 'Вода', color: '#FFD700' }
];

export const fuelItems = [
	{ id: 'gasoline', name: 'Бензин', color: '#FFE66D' },
	{ id: 'diesel', name: 'Дизел', color: '#FFD700' },
	{ id: 'lpg', name: 'LPG', color: '#33FF5E' },
	{ id: 'methane', name: 'Метан', color: '#FF8E53' }
];

export const timeRanges = [
	{ id: '3months', label: '3 месеца', period: 'months', length: 3 },
	{ id: '6months', label: '6 месеца', period: 'months', length: 6 },
	{ id: '1year', label: '1 година', period: 'months', length: 12 },
	{ id: '3years', label: '3 години', period: 'years', length: 3 },
	{ id: '5years', label: '5 години', period: 'years', length: 5 },
	{ id: '10years', label: '10 години', period: 'years', length: 10 }
];

// Default application selections
export const appDefaults = {
	range: '3months',
	foods: ['bread'],
	fuel: 'gasoline',
	utilities: ['electricity']
};

// Validation constants for form inputs
export const VALIDATION_LIMITS = {
	MAX_VALUE: 1000000, // 1 million limit
	MIN_POSITIVE_VALUE: 0 // Minimum positive value
};

export const mortgageFormDefaults = {
	monthlyBudget: 4000,
	propertyPrice: 300000,
	downPayment: 60000,
	interestRate: 2.55,
	loanTermYears: 25,
	extraPaymentPerYear: 0,
	paymentType: 'annuity',
	currency: 'BGN'
};
