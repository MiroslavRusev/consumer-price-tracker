# Centralized Form Configuration System

This system provides a single source of truth for all form fields, their validation rules, and related operations.

## Key Benefits

✅ **Single Source of Truth** - All field definitions in one place  
✅ **Type Safety** - Full TypeScript support with autocomplete  
✅ **Easy Maintenance** - Add/modify fields in one location  
✅ **Consistent Validation** - Same rules applied everywhere  
✅ **Reduced Duplication** - No more hardcoded field names

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
import { extractAndValidateFormData } from '$lib/utils/formDataBuilder';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Single line extracts & validates ALL fields
		const data = extractAndValidateFormData(formData);

		// Use with full type safety
		const { monthlyBudgetThen, foodExpense, newField } = data;

		// All fields are guaranteed to be numbers and validated
	} catch (error) {
		// Validation errors automatically thrown
	}
};
```

### 3. Use in Frontend

```typescript
import { getRequiredFields, getFieldValidationRules, getAllFieldKeys } from '$lib/utils/formDataBuilder';

// Get all required field keys for validation
const requiredFields = getRequiredFields();

// Get validation rules for a specific field
const rules = getFieldValidationRules('monthlyBudgetThen');
// Returns: { required: true, positive: true, displayName: "..." }

// Generate form fields dynamically
const allFields = getAllFieldKeys();
```

## Available Configuration Options

```typescript
interface FieldConfig {
	key: string; // HTML form field name
	displayName: string; // For error messages (Bulgarian)
	required: boolean; // Validation rule
	positive?: boolean; // Number validation (default: true)
	defaultValue?: string; // Not used yet, for future
	category: 'user_input' | 'calculated'; // Field grouping
}
```

## Available Utility Functions

- `extractAndValidateFormData(formData)` - Main function, validates all fields
- `getRequiredFields()` - Get all required field keys
- `getFieldsByCategory(category)` - Get fields by category
- `validateSpecificFields(formData, fieldNames)` - Validate only specific fields
- `getFieldValidationRules(fieldName)` - Get validation rules for frontend
- `getAllFieldKeys()` - Get all configured field keys
- `getFieldDisplayNames()` - Get mapping of keys to display names
- `isValidField(fieldName)` - Check if field exists in config

## Migration Guide

**Before:**

```typescript
// Hardcoded everywhere
const monthlyBudget = parseAndValidate(formData.get('monthly-budget-now'), 'Месечен доход', true);
```

**After:**

```typescript
// Centralized configuration
const data = extractAndValidateFormData(formData);
const { monthlyBudgetNow } = data; // Fully typed and validated
```

## Adding New Validation Rules

To add new validation options, extend `FieldConfig`:

```typescript
interface FieldConfig {
	// ... existing properties ...
	min?: number; // Minimum value
	max?: number; // Maximum value
	regex?: string; // Pattern validation
}
```

Then update `extractAndValidateFormData()` to use the new rules.
