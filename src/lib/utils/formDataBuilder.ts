import type { FormData as AppFormData } from '$lib/interfaces';
import { parseAndValidate } from './formValidator';

// Centralized field configuration - single source of truth
export interface FieldConfig {
	key: string; // Form field name/key
	displayName: string; // Human readable name for errors
	required: boolean; // Whether field is required
	positive?: boolean; // Whether value must be positive (default: true for numbers)
	defaultValue?: string; // Default value if not provided
	category: 'user_input' | 'calculated'; // Field category
}

// Single place to define ALL form fields and their validation rules
export const FORM_FIELD_CONFIG: Record<string, FieldConfig> = {
	// User input fields
	monthlyBudgetThen: {
		key: 'monthly-budget-then',
		displayName: 'Месечен доход в началото на периода',
		required: true,
		category: 'user_input'
	},
	monthlyBudgetNow: {
		key: 'monthly-budget-now',
		displayName: 'Месечен доход към днешна дата',
		required: true,
		category: 'user_input'
	},
	foodExpense: {
		key: 'food-expense',
		displayName: 'Разход храна към днешна дата',
		required: true,
		category: 'user_input'
	},
	fuelExpense: {
		key: 'fuel-expense',
		displayName: 'Разход гориво към днешна дата',
		required: false,
		category: 'user_input'
	},
	electricityExpense: {
		key: 'electricity-expense',
		displayName: 'Разход електричество към днешна дата',
		required: false,
		category: 'user_input'
	},
	waterExpense: {
		key: 'water-expense',
		displayName: 'Разход вода към днешна дата',
		required: false,
		category: 'user_input'
	},

	// Calculated fields passed from frontend
	inflationRate: {
		key: 'inflationRate',
		displayName: 'Инфлация',
		required: true,
		positive: false, // Can be negative
		category: 'calculated'
	},
	historicalFuelPrice: {
		key: 'historicalFuelPrice',
		displayName: 'Историческа цена на горивото',
		required: false,
		category: 'calculated'
	},
	electricityHistoricalPrice: {
		key: 'electricityHistoricalPrice',
		displayName: 'Историческа цена на електричеството',
		required: false,
		category: 'calculated'
	},
	waterHistoricalPrice: {
		key: 'waterHistoricalPrice',
		displayName: 'Историческа цена на водата',
		required: false,
		category: 'calculated'
	},
	fuelAmount: {
		key: 'fuelAmount',
		displayName: 'Количество гориво',
		required: false,
		category: 'calculated'
	},
	electricityCurrentPrice: {
		key: 'electricityCurrentPrice',
		displayName: 'Текуща цена на електричеството',
		required: false,
		category: 'calculated'
	},
	waterCurrentPrice: {
		key: 'waterCurrentPrice',
		displayName: 'Текуща цена на водата',
		required: false,
		category: 'calculated'
	}
};

// Type for parsed and validated form data
export type ParsedFormData = {
	[K in keyof typeof FORM_FIELD_CONFIG]: number;
};

// Get all required field keys
export const getRequiredFields = (): string[] => {
	return Object.values(FORM_FIELD_CONFIG)
		.filter((config) => config.required)
		.map((config) => config.key);
};

// Get fields by category
export const getFieldsByCategory = (category: 'user_input' | 'calculated'): FieldConfig[] => {
	return Object.values(FORM_FIELD_CONFIG).filter((config) => config.category === category);
};

// Extract and validate all form data based on configuration
export const extractAndValidateFormData = (webFormData: FormData): ParsedFormData => {
	const result: Partial<ParsedFormData> = {};

	// Process each configured field
	for (const [fieldName, config] of Object.entries(FORM_FIELD_CONFIG)) {
		const rawValue = webFormData.get(config.key) as string;

		// Parse and validate using existing validator with config rules
		const validatedValue = parseAndValidate(rawValue, config.displayName, config.required, config.positive);

		result[fieldName as keyof ParsedFormData] = validatedValue;
	}

	return result as ParsedFormData;
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

// Utility to get field configuration by key
export const getFieldConfig = (fieldKey: string): FieldConfig | undefined => {
	return Object.values(FORM_FIELD_CONFIG).find((config) => config.key === fieldKey);
};

// Build form data map (if needed for debugging or other purposes)
export const buildFormDataMap = (webFormData: FormData): Record<string, string> => {
	const formMap: Record<string, string> = {};
	for (const [key, value] of webFormData.entries()) {
		formMap[key] = value as string;
	}
	return formMap;
};

// Additional utilities for using the centralized configuration

// Get all field keys (useful for form generation)
export const getAllFieldKeys = (): string[] => {
	return Object.values(FORM_FIELD_CONFIG).map((config) => config.key);
};

// Get field display names mapping (useful for error messages)
export const getFieldDisplayNames = (): Record<string, string> => {
	const displayNames: Record<string, string> = {};
	Object.values(FORM_FIELD_CONFIG).forEach((config) => {
		displayNames[config.key] = config.displayName;
	});
	return displayNames;
};

// Validate only specific fields (useful for partial validation)
export const validateSpecificFields = (
	webFormData: FormData,
	fieldNames: (keyof typeof FORM_FIELD_CONFIG)[]
): Partial<ParsedFormData> => {
	const result: Partial<ParsedFormData> = {};

	for (const fieldName of fieldNames) {
		const config = FORM_FIELD_CONFIG[fieldName];
		if (!config) continue;

		const rawValue = webFormData.get(config.key) as string;
		const validatedValue = parseAndValidate(rawValue, config.displayName, config.required, config.positive);

		result[fieldName] = validatedValue;
	}

	return result;
};

// Check if field exists in configuration
export const isValidField = (fieldName: string): boolean => {
	return fieldName in FORM_FIELD_CONFIG;
};

// Get validation rules for a field (useful for frontend validation)
export const getFieldValidationRules = (fieldName: keyof typeof FORM_FIELD_CONFIG) => {
	const config = FORM_FIELD_CONFIG[fieldName];
	return {
		required: config.required,
		positive: config.positive ?? true,
		displayName: config.displayName
	};
};
