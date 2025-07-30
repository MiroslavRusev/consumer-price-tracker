import type { FormData as AppFormData } from '$lib/interfaces';

// Centralized field configuration - single source of truth
export interface FieldConfig {
	key: string; // Form field name/key
	displayName: string; // Human readable name for errors
	required: boolean; // Whether field is required
	positive?: boolean; // Whether value must be positive (default: true for numbers)
	category: 'user_input' | 'calculated'; // Field category
	type: 'number'; // Expected data type, can be extended in future, but change in parsing is required
}

// Single place to define ALL form fields and their validation rules
export const FORM_FIELD_CONFIG: Record<string, FieldConfig> = {
	// User input fields
	monthlyBudgetThen: {
		key: 'monthly-budget-then',
		displayName: 'Месечен доход в началото на периода',
		required: true,
		category: 'user_input',
		type: 'number'
	},
	monthlyBudgetNow: {
		key: 'monthly-budget-now',
		displayName: 'Месечен доход към днешна дата',
		required: true,
		category: 'user_input',
		type: 'number'
	},
	foodExpense: {
		key: 'food-expense',
		displayName: 'Разход храна към днешна дата',
		required: true,
		category: 'user_input',
		type: 'number'
	},
	fuelExpense: {
		key: 'fuel-expense',
		displayName: 'Разход гориво към днешна дата',
		required: false,
		category: 'user_input',
		type: 'number'
	},
	electricityExpense: {
		key: 'electricity-expense',
		displayName: 'Разход електричество към днешна дата',
		required: false,
		category: 'user_input',
		type: 'number'
	},
	waterExpense: {
		key: 'water-expense',
		displayName: 'Разход вода към днешна дата',
		required: false,
		category: 'user_input',
		type: 'number'
	},

	// Calculated fields passed from frontend
	inflationRate: {
		key: 'inflationRate',
		displayName: 'Инфлация',
		required: true,
		positive: false, // Can be negative
		category: 'calculated',
		type: 'number'
	},
	historicalFuelPrice: {
		key: 'historicalFuelPrice',
		displayName: 'Историческа цена на горивото',
		required: false,
		category: 'calculated',
		type: 'number'
	},
	electricityHistoricalPrice: {
		key: 'electricityHistoricalPrice',
		displayName: 'Историческа цена на електричеството',
		required: false,
		category: 'calculated',
		type: 'number'
	},
	waterHistoricalPrice: {
		key: 'waterHistoricalPrice',
		displayName: 'Историческа цена на водата',
		required: false,
		category: 'calculated',
		type: 'number'
	},
	fuelAmount: {
		key: 'fuelAmount',
		displayName: 'Количество гориво',
		required: false,
		category: 'calculated',
		type: 'number'
	},
	electricityCurrentPrice: {
		key: 'electricityCurrentPrice',
		displayName: 'Текуща цена на електричеството',
		required: false,
		category: 'calculated',
		type: 'number'
	},
	waterCurrentPrice: {
		key: 'waterCurrentPrice',
		displayName: 'Текуща цена на водата',
		required: false,
		category: 'calculated',
		type: 'number'
	}
};

// Type for parsed and validated form data - all fields are currently numbers
export type ParsedFormData = {
	[K in keyof typeof FORM_FIELD_CONFIG]: number;
};

// Function to create initial form data with empty strings (for UI)
export const createInitialFormData = (): AppFormData => {
	return {
		monthlyBudgetThen: '',
		monthlyBudgetNow: '',
		foodExpense: '',
		electricityExpense: '',
		waterExpense: ''
	};
};
