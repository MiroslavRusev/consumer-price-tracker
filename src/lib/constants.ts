export const productCodes = {
	bread: 'CP01113',
	pork: 'CP01122',
	poultry: 'CP01124',
	milk: 'CP01141',
	eggs: 'CP01147',
	oil: 'CP0115',
	butter: 'CP01151',
	potatoes: 'CP01174',
	sugar: 'CP01181'
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
	{ id: 'sugar', name: 'Захар', code: 'CP01181', color: '#FF8E53' }
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
	{ id: '3months', label: '3 months', period: 'months', length: 3 },
	{ id: '6months', label: '6 months', period: 'months', length: 6 },
	{ id: '1year', label: '1 year', period: 'months', length: 12 },
	{ id: '5years', label: '5 years', period: 'years', length: 5 },
	{ id: '10years', label: '10 years', period: 'years', length: 10 }
];

export const formFields = [
	{
		id: 'monthly-budget-then',
		label: 'Месечен доход в началото на периода',
		type: 'text',
		key: 'monthlyBudgetThen'
	},
	{
		id: 'monthly-budget-now',
		label: 'Месечен доход към днешна дата',
		type: 'text',
		key: 'monthlyBudget'
	},
	{
		id: 'food-expense',
		label: 'Разход храна към днешна дата',
		type: 'text',
		key: 'foodExpense'
	},
	{
		id: 'fuel-expense',
		label: 'Разход гориво към днешна дата',
		type: 'text',
		key: 'fuelExpense'
	},
	{
		id: 'electricity-expense',
		label: 'Разход електричество към днешна дата',
		type: 'text',
		key: 'electricityExpense'
	},
	{
		id: 'water-expense',
		label: 'Разход вода към днешна дата',
		type: 'text',
		key: 'waterExpense'
	}
];

// Default application selections
export const appDefaults = {
	range: '3months',
	foods: ['bread'],
	fuels: ['gasoline'],
	utilities: ['electricity']
};
