import { VALIDATION_LIMITS } from '$lib/constants';
import ValidationError from '$lib/errorHandling';
import { FORM_FIELD_CONFIG, type ParsedFormData } from '$lib/utils/formDataBuilder';

// Validation constants
const maxValue: number = VALIDATION_LIMITS.MAX_VALUE;
const minPositiveValue: number = VALIDATION_LIMITS.MIN_POSITIVE_VALUE;

// Simple validation result type
export interface ValidationResult {
	isValid: boolean;
	isEmpty: boolean;
	errorMessage?: string;
}

// Single validation function that handles all logic correctly
export const validateField = (fieldName: keyof typeof FORM_FIELD_CONFIG, value: string): ValidationResult => {
	const config = FORM_FIELD_CONFIG[fieldName];
	const trimmedValue = value.trim();

	// Check if empty
	if (trimmedValue === '') {
		return {
			isValid: !config.required, // Valid if not required, invalid if required
			isEmpty: true,
			errorMessage: config.required ? 'Полето е задължително' : undefined
		};
	}

	// Special case for inflation rate which can be a string with comma separated values
	const isInflationRate = fieldName === 'inflationRate';
	if (isInflationRate) {
		return {
			isValid: true,
			isEmpty: false
		};
	}

	// Check if valid number
	const numValue = Number(trimmedValue);

	if (isNaN(numValue)) {
		return {
			isValid: false,
			isEmpty: false,
			errorMessage: 'Невалидно число'
		};
	}

	// Check positive constraint
	const shouldBePositive = config.positive !== false; // Default to true
	if (shouldBePositive && numValue <= 0) {
		return {
			isValid: false,
			isEmpty: false,
			errorMessage: 'Стойността трябва да е положителна'
		};
	}

	// Check max value
	if (numValue > VALIDATION_LIMITS.MAX_VALUE) {
		return {
			isValid: false,
			isEmpty: false,
			errorMessage: `Стойността не може да надвишава ${VALIDATION_LIMITS.MAX_VALUE.toLocaleString()}`
		};
	}

	return {
		isValid: true,
		isEmpty: false
	};
};

// Simple step validation functions
export const validateStep1 = (formData: { monthlyBudgetThen: string; monthlyBudgetNow: string }): boolean => {
	const field1 = validateField('monthlyBudgetThen', formData.monthlyBudgetThen);
	const field2 = validateField('monthlyBudgetNow', formData.monthlyBudgetNow);
	return field1.isValid && field2.isValid;
};

export const validateStep2 = (formData: {
	foodExpense: string;
	electricityExpense?: string;
	waterExpense?: string;
}): boolean => {
	const foodValid = validateField('foodExpense', formData.foodExpense);

	// Optional utility fields - only validate if they have values
	const electricityValid =
		!formData.electricityExpense ||
		formData.electricityExpense.trim() === '' ||
		validateField('electricityExpense', formData.electricityExpense).isValid;
	const waterValid =
		!formData.waterExpense ||
		formData.waterExpense.trim() === '' ||
		validateField('waterExpense', formData.waterExpense).isValid;

	return foodValid.isValid && electricityValid && waterValid;
};

// Extract and validate all form data based on configuration (for server-side)
export const extractAndValidateFormData = (webFormData: FormData): ParsedFormData => {
	const result: Partial<ParsedFormData> = {};

	// Process each configured field
	for (const [fieldName, config] of Object.entries(FORM_FIELD_CONFIG)) {
		const rawValue = webFormData.get(config.key) as string;
		const validation = validateField(fieldName as keyof typeof FORM_FIELD_CONFIG, rawValue || '');

		if (!validation.isValid && config.required) {
			throw new Error(`${config.displayName}: ${validation.errorMessage}`);
		}

		// Convert to appropriate type based on field
		result[fieldName as keyof ParsedFormData] = validation.isEmpty ? 0 : parseFloat(rawValue);
	}

	return result as ParsedFormData;
};

// Legacy function - kept for backward compatibility
export function parseAndValidate(
	rawValue: string,
	displayName: string,
	required: boolean = false,
	positive: boolean = true
): number {
	if (!rawValue || rawValue.trim() === '') {
		if (required) {
			throw new ValidationError(`${displayName} е задължително поле`);
		}
		return 0;
	}

	const value = parseFloat(rawValue);

	if (isNaN(value)) {
		throw new ValidationError(`${displayName} не е валидно число`);
	}
	if (positive && value < minPositiveValue) {
		throw new ValidationError(`${displayName} трябва да има положителна стойност`);
	}
	if (value > maxValue) {
		throw new ValidationError(`${displayName} не може да надвишава 1,000,000`);
	}
	return value;
}
