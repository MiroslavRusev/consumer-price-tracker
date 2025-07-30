# Centralized Form Configuration and Validation System

This system provides a separation of concerns between form configuration and validation logic:

- **`formDataBuilder.ts`** - Configuration and data structures
- **`formValidator.ts`** - All validation logic and functions

## Key Benefits

✅ **Single Source of Truth** - All field definitions in one place  
✅ **Type Safety** - Full TypeScript support with autocomplete  
✅ **Easy Maintenance** - Add/modify fields in one location  
✅ **Consistent Validation** - Same rules applied everywhere  
✅ **Reduced Duplication** - No more hardcoded field names  
✅ **Separated Concerns** - Configuration vs validation logic

## Quick Start

### 1. Add a New Field

Edit `FORM_FIELD_CONFIG` in `formDataBuilder.ts`:

```typescript
export const FORM_FIELD_CONFIG: Record<string, FieldConfig> = {
	// ... existing fields ...

	newField: {
		key: 'new-field-name',
		displayName: 'Human Readable Name',
		required: true, // or false
		positive: true, // for numbers, optional (default: true)
		category: 'user_input' // or 'calculated'
	}
};
```

### 2. Use in Server (API Routes)

```typescript
import { extractAndValidateFormData } from '$lib/utils/formValidator';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Single line extracts & validates ALL fields
		const data = extractAndValidateFormData(formData);

		// Use with full type safety
		const { monthlyBudgetThen, foodExpense, newField } = data;

		// All fields are guaranteed to be numbers and validated
	} catch (error) {
		// Validation errors automatically thrown with descriptive messages
	}
};
```

### 3. Use in Frontend Components

```typescript
import { FORM_FIELD_CONFIG } from '$lib/utils/formDataBuilder';
import { validateField, validateStep1, validateStep2 } from '$lib/utils/formValidator';

// Validate a single field
const validation = validateField('monthlyBudgetThen', userInput);
if (!validation.isValid) {
	console.log(validation.errorMessage); // "Field is required" | "Invalid number" | etc.
}

// Validate entire steps
const isStep1Valid = validateStep1(formData);
const isStep2Valid = validateStep2(formData);
```

## File Structure

### `formDataBuilder.ts` - Configuration Only

- `FORM_FIELD_CONFIG` - All field definitions
- `FieldConfig` interface
- `ParsedFormData` type
- `createInitialFormData()` - UI initialization

### `formValidator.ts` - Validation Logic Only

- `validateField()` - Single field validation with detailed errors
- `validateStep1()` / `validateStep2()` - Step validation
- `extractAndValidateFormData()` - Server-side validation
- `ValidationResult` interface
- Legacy `parseAndValidate()` for backward compatibility

## Available Configuration Options

```typescript
interface FieldConfig {
	key: string; // HTML form field name
	displayName: string; // For error messages (Bulgarian)
	required: boolean; // Validation rule
	positive?: boolean; // Number validation (default: true)
	category: 'user_input' | 'calculated'; // Field grouping
}
```

## Validation Result Format

```typescript
interface ValidationResult {
	isValid: boolean;
	isEmpty: boolean;
	errorMessage?: string; // Specific error messages
}
```

## Migration Guide

**Before (scattered validation):**

```typescript
// Multiple validation functions everywhere
$: monthlyBudgetValid = value.trim() !== '' && !isNaN(Number(value));
$: isStep1Valid = monthlyBudgetThenValid && monthlyBudgetNowValid;
```

**After (centralized validation):**

```typescript
// Clean, centralized validation
import { validateStep1 } from '$lib/utils/formValidator';
$: isStep1Valid = validateStep1(formData);
```

## Adding New Validation Rules

To add new validation options:

1. **Extend `FieldConfig` in `formDataBuilder.ts`:**

```typescript
interface FieldConfig {
	// ... existing properties ...
	min?: number; // Minimum value
	max?: number; // Maximum value
}
```

2. **Update `validateField()` in `formValidator.ts`:**

```typescript
// Add new validation logic
if (config.min && numValue < config.min) {
	return { isValid: false, isEmpty: false, errorMessage: `Minimum value is ${config.min}` };
}
```
