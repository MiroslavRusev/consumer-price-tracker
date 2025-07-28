import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { FormCalculationResult } from '$lib/interfaces';
import { formFields } from '$lib/constants';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Validation constants
		const MAX_VALUE = 1000000; // 1 million limit
		const MIN_POSITIVE_VALUE = 0.01; // Minimum positive value

		// Extract and validate all form values
		const values: Record<string, number> = {};
		for (const field of formFields) {
			const value = parseFloat(formData.get(field.id) as string);
			values[field.key] = value;
			// Validate each value
			if (isNaN(value)) {
				return json({ error: `${field.label} не е валидно число` }, { status: 400 });
			}
			if (value < MIN_POSITIVE_VALUE) {
				return json({ error: `${field.label} трябва да има стойност по-голяма от 0` }, { status: 400 });
			}
			if (value > MAX_VALUE) {
				return json({ error: `${field.label} не може да надвишава 1,000,000` }, { status: 400 });
			}
		}
		// Inflation rate and historical prices calculated programmatically not from user input, so it's not part of form fields
		values['inflationRate'] = parseFloat(formData.get('inflationRate') as string);
		values['historicalFuelPrice'] = parseFloat(formData.get('historicalFuelPrice') as string);
		values['electricityHistoricalPrice'] = parseFloat(formData.get('electricityHistoricalPrice') as string);
		values['waterHistoricalPrice'] = parseFloat(formData.get('waterHistoricalPrice') as string);
		values['fuelAmount'] = parseFloat(formData.get('fuelAmount') as string);
		values['electricityCurrentPrice'] = parseFloat(formData.get('electricityCurrentPrice') as string);
		values['waterCurrentPrice'] = parseFloat(formData.get('waterCurrentPrice') as string);

		if (isNaN(values['inflationRate'])) {
			return json({ error: 'Инфлацията не е валидно число' }, { status: 400 });
		}
		if (isNaN(values['historicalFuelPrice'])) {
			return json({ error: 'Историческите цени на горивото не са валидни' }, { status: 400 });
		}
		if (isNaN(values['electricityHistoricalPrice'])) {
			return json({ error: 'Историческите цени на комуналните услуги не са валидни' }, { status: 400 });
		}
		if (isNaN(values['fuelAmount'])) {
			return json({ error: 'Количеството гориво не е валидно число' }, { status: 400 });
		}
		if (isNaN(values['electricityCurrentPrice'])) {
			return json({ error: 'Текущата цена на комуналните услуги не е валидна' }, { status: 400 });
		}

		// Destructure values for easier access
		const {
			monthlyBudget,
			monthlyBudgetThen,
			foodExpense,
			fuelExpense,
			fuelAmount,
			electricityExpense,
			waterExpense,
			inflationRate,
			historicalFuelPrice,
			electricityCurrentPrice,
			electricityHistoricalPrice,
			waterCurrentPrice,
			waterHistoricalPrice
		} = values;

		// Calculate purchasing power change
		// This is a simplified calculation
		const totalExpensesNow = foodExpense + fuelExpense + electricityExpense + waterExpense;

		// Calculate fuel expense at the start of the period
		const fuelExpenseThen = historicalFuelPrice * fuelAmount;
		// Calculate utility expense at the start of the period
		const electricityExpenseThen = (electricityExpense / electricityCurrentPrice) * electricityHistoricalPrice;
		const waterExpenseThen = (waterExpense / waterCurrentPrice) * waterHistoricalPrice;

		// Calculate total expenses at the start of the period
		const totalExpensesThen = foodExpense / (1 + inflationRate) + fuelExpenseThen + electricityExpenseThen + waterExpenseThen;

		// Calculate the combined inflation rate
		const fuelInflationRate = (fuelExpense - fuelExpenseThen) / fuelExpenseThen;
		const electricityInflationRate = (electricityExpense - electricityExpenseThen) / electricityExpenseThen;
		const waterInflationRate = (waterExpense - waterExpenseThen) / waterExpenseThen;
		// Return the average of the three inflation rates so that we can use it to calculate the purchasing power change
		const combinedInflationRate = (inflationRate + fuelInflationRate + electricityInflationRate + waterInflationRate) / 4;

		// Calculate the remaining budget for each period
		const currentDisposableIncome = monthlyBudget - totalExpensesNow;
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
			monthlyBudget,
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
		console.error('Error processing form:', error);
		return json({ error: 'Failed to process form data' }, { status: 500 });
	}
};
