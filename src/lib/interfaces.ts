// =============================================================================
// FOOD-RELATED INTERFACES
// =============================================================================

/** Base interface for food price data structure used in charts */
interface FoodPriceData {
	label: string;
	data: number[];
	backgroundColor: string;
	borderColor: string;
}

/** Extended food price data with type discriminator for internal logic */
interface FoodPriceDataWithType extends FoodPriceData {
	type: 'food';
}

/** Represents a food item with display properties */
interface FoodItem {
	id: string;
	name: string;
	color: string;
}

/** API response structure for food price endpoints */
interface FoodApiResponse {
	foodItems: FoodItem[];
	labels: string[];
	priceData: { [key: string]: number[] };
}

// =============================================================================
// FUEL-RELATED INTERFACES
// =============================================================================

/** Data structure for fuel bar chart visualization */
interface FuelBarData {
	label: string;
	data: number[];
	backgroundColor: string | string[];
	secondBackgroundColor: string;
	borderColor: string;
}

/** Chart data structure specifically for fuel bar charts */
interface FuelBarChartData {
	labels: string[];
	datasets: FuelBarData[];
}

/** Represents a fuel item with display properties */
interface FuelItem {
	id: string;
	name: string;
	color: string;
}

/** Request object for fuel price API calls */
interface FuelRequest {
	fuelType: string;
	date: string;
}

/** Individual fuel data point from API responses */
interface FuelData {
	fuel: string;
	price: number;
	dimension: string;
	date: string;
	status?: string;
}

/** API response structure for fuel price endpoints */
interface FuelApiResponse {
	fuelData: FuelData[];
}

// =============================================================================
// UTILITY-RELATED INTERFACES
// =============================================================================

/** Base interface for utility price data structure used in charts */
interface UtilityPriceData {
	label: string;
	data: number[];
	backgroundColor: string;
	borderColor: string;
}

/** Extended utility price data with type discriminator for internal logic */
interface UtilityPriceDataWithType extends UtilityPriceData {
	type: 'utility';
}

/** Represents a utility item with display properties */
interface UtilityItem {
	id: string;
	name: string;
	color: string;
}

/** API response structure for utility price endpoints */
interface UtilityApiResponse {
	utilityItem?: string; // For individual utility API responses (electricity or water)
	utilityItems?: string[]; // For combined utility responses
	labels: string[];
	priceData: { [key: string]: number[] };
}

// =============================================================================
// CHART & VISUALIZATION INTERFACES
// =============================================================================

/** Generic chart data structure for food and utility charts */
interface ChartData {
	labels: string[];
	datasets: (FoodPriceData | UtilityPriceData)[];
}

// =============================================================================
// FORM & UI INTERFACES
// =============================================================================

/** Form data structure for the calculation form */
interface FormData {
	monthlyBudgetThen: string;
	monthlyBudgetNow: string;
	foodExpense: string;
	electricityExpense: string;
	waterExpense: string;
}

/** Result object from form calculation operations */
interface FormCalculationResult {
	monthlyBudget: number;
	monthlyBudgetThen: number;
	totalExpensesNow: number;
	totalExpensesThen: number;
	currentDisposableIncome: number;
	previousDisposableIncome: number;
	inflationRate: number;
	netExpensesDifference: number;
	previousSalaryValueMatchingCurrentPurchasingPower: number;
}

// =============================================================================
// EXTERNAL API INTERFACES
// =============================================================================

/** Response structure from Eurostat API */
interface EurostatResponse {
	dimension: {
		time?: {
			category: {
				index: Record<string, string>;
			};
		};
		coicop?: {
			category: {
				label: Record<string, string>;
				index: Record<string, number>;
			};
		};
	};
	value: Record<string, string>;
}

// =============================================================================
// EXPORTS
// =============================================================================

export type {
	// Food-related
	FoodPriceData,
	FoodPriceDataWithType,
	FoodItem,
	FoodApiResponse,
	// Fuel-related
	FuelBarData,
	FuelBarChartData,
	FuelItem,
	FuelRequest,
	FuelData,
	FuelApiResponse,
	// Utility-related
	UtilityPriceData,
	UtilityPriceDataWithType,
	UtilityItem,
	UtilityApiResponse,
	// Chart & Visualization
	ChartData,
	// Form & UI
	FormData,
	FormCalculationResult,
	// External APIs
	EurostatResponse
};
