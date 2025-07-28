// Type definitions for the food price data structure
interface FoodPriceData {
	label: string;
	data: number[];
	backgroundColor: string;
	borderColor: string;
}

// Type definitions for the utility price data structure
interface UtilityPriceData {
	label: string;
	data: number[];
	backgroundColor: string;
	borderColor: string;
}

// Extended interfaces for internal logic with type discriminators
interface FoodPriceDataWithType extends FoodPriceData {
	type: 'food';
}

interface UtilityPriceDataWithType extends UtilityPriceData {
	type: 'utility';
}

// Type definitions for fuel bar chart data
interface FuelBarData {
	label: string;
	data: number[];
	backgroundColor: string | string[];
	secondBackgroundColor: string;
	borderColor: string;
}

// Type definitions for the chart data structure
interface ChartData {
	labels: string[];
	datasets: (FoodPriceData | UtilityPriceData)[];
}

// Type definitions for fuel bar chart data structure
interface FuelBarChartData {
	labels: string[];
	datasets: FuelBarData[];
}

// Type definitions for the food items
interface FoodItem {
	id: string;
	name: string;
	color: string;
}

// Type definitions for the fuel items
interface FuelItem {
	id: string;
	name: string;
	color: string;
}

// Type definitions for the utility items
interface UtilityItem {
	id: string;
	name: string;
	color: string;
}

// Type definitions for form field
interface FormField {
	id: string;
	label: string;
	type: string;
	key: string;
}

// Type definitions for food API response
interface FoodApiResponse {
	foodItems: FoodItem[];
	labels: string[];
	priceData: { [key: string]: number[] };
}

interface UtilityApiResponse {
	utilityItem?: string; // For individual utility API responses (electricity or water)
	utilityItems?: string[]; // For combined utility responses
	labels: string[];
	priceData: { [key: string]: number[] };
}

// Type definitions for fuel API response
interface FuelApiResponse {
	fuelData: FuelData[];
}

// Type definitions for the fuel request object
interface FuelRequest {
	fuelType: string;
	date: string;
}

interface FuelData {
	fuel: string;
	price: number;
	dimension: string;
	date: string;
	status?: string;
}

// Type definitions for Eurostat API response
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

// Type definitions for form calculation result
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

export type {
	FoodPriceData,
	FoodPriceDataWithType,
	UtilityPriceData,
	UtilityPriceDataWithType,
	ChartData,
	FuelBarChartData,
	FuelBarData,
	FoodItem,
	FuelItem,
	FoodApiResponse,
	FuelApiResponse,
	EurostatResponse,
	FormField,
	FormCalculationResult,
	FuelRequest,
	FuelData,
	UtilityApiResponse,
	UtilityItem
};
