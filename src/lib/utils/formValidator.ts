import { VALIDATION_LIMITS } from '$lib/constants';
import ValidationError from '$lib/errorHandling';
// Validation constants
const maxValue: number = VALIDATION_LIMITS.MAX_VALUE;
const minPositiveValue: number = VALIDATION_LIMITS.MIN_POSITIVE_VALUE;

// Helper function to parse and validate a form field
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
