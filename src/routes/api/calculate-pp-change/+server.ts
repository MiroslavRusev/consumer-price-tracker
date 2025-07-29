import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { FormCalculationResult } from '$lib/interfaces';
import ValidationError from '$lib/errorHandling';
import { extractAndValidateFormData } from '$lib/utils/formDataBuilder';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Extract and validate all form data using centralized configuration
		const data = extractAndValidateFormData(formData);
		// Now use the validated data directly with proper typing
		const {
			monthlyBudgetThen,
			monthlyBudgetNow,
			foodExpense,
			fuelExpense,
			electricityExpense,
			waterExpense,
			inflationRate,
			historicalFuelPrice,
			electricityHistoricalPrice,
			waterHistoricalPrice,
			fuelAmount,
			electricityCurrentPrice,
			waterCurrentPrice
		} = data;

		// This is a simplified calculation of current expenses
		const totalExpensesNow = foodExpense + fuelExpense + electricityExpense + waterExpense;

		// Handle optional expenses
		// Calculate fuel expense at the start of the period
		let fuelExpenseThen = 0;
		let fuelInflationRate = 0;
		if (fuelExpense > 0) {
			fuelExpenseThen = historicalFuelPrice * fuelAmount;
			fuelInflationRate = (fuelExpense - fuelExpenseThen) / fuelExpenseThen;
		}
		// Calculate utility expense at the start of the period
		let electricityExpenseThen = 0;
		let electricityInflationRate = 0;
		if (electricityExpense > 0 && electricityCurrentPrice > 0 && electricityHistoricalPrice > 0) {
			electricityExpenseThen = (electricityExpense / electricityCurrentPrice) * electricityHistoricalPrice;
			electricityInflationRate = (electricityExpense - electricityExpenseThen) / electricityExpenseThen;
		}
		// Calculate water expense at the start of the period
		let waterExpenseThen = 0;
		let waterInflationRate = 0;
		if (waterExpense > 0 && waterCurrentPrice > 0 && waterHistoricalPrice > 0) {
			waterExpenseThen = (waterExpense / waterCurrentPrice) * waterHistoricalPrice;
			waterInflationRate = (waterExpense - waterExpenseThen) / waterExpenseThen;
		}

		// Calculate total expenses at the start of the period
		const totalExpensesThen =
			foodExpense / (1 + inflationRate) + fuelExpenseThen + electricityExpenseThen + waterExpenseThen;

		// Return the average of the three inflation rates so that we can use it to calculate the purchasing power change
		const combinedInflationRate =
			(inflationRate + fuelInflationRate + electricityInflationRate + waterInflationRate) / 4;

		// Calculate the remaining budget for each period
		const currentDisposableIncome = monthlyBudgetNow - totalExpensesNow;
		const previousDisposableIncome = monthlyBudgetThen - totalExpensesThen;

		// Calculate the net expenses difference in current prices
		// Convert historical expenses to current prices using combined inflation rate
		const totalExpensesThenInCurrentPrices = totalExpensesThen * (1 + combinedInflationRate);
		const netExpensesDifference = totalExpensesNow - totalExpensesThenInCurrentPrices;

		// Calculate what the previous salary should have been to match current purchasing power
		// Formula: previousSalary = currentDisposableIncome + previousExpenses
		// This gives us the salary needed in the past to have the same disposable income
		const previousSalaryValueMatchingCurrentPurchasingPower = currentDisposableIncome + totalExpensesThen;

		const result: FormCalculationResult = {
			monthlyBudget: monthlyBudgetNow,
			monthlyBudgetThen,
			totalExpensesNow,
			totalExpensesThen,
			currentDisposableIncome,
			previousDisposableIncome,
			inflationRate: combinedInflationRate * 100,
			netExpensesDifference,
			previousSalaryValueMatchingCurrentPurchasingPower
		};
		// Calculate new purchasing power
		return json(result);
	} catch (error) {
		if (error instanceof ValidationError) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Failed to process form data' }, { status: 500 });
	}
};
