<script lang="ts">
	import NavButtons from './navButtons.svelte';
	import FormHeader from './formHeader.svelte';
	import FormResultsAndErrors from './formResultsAndErrors.svelte';
	import ProgressIndicator from './progressIndicator.svelte';
	import FormField from './FormField.svelte';
	import { fuelItems } from '$lib/constants';
	import { createInitialFormData } from '$lib/utils/formDataBuilder';
	import { svgExporter } from '$lib/assets/svgExporter';
	import { validateStep1, validateStep2 } from '$lib/utils/formValidator';
	import type { FormCalculationResult, FormData } from '$lib/interfaces';
	import { selectedFuel, currentFuelPrice, historicalFuelPrice, selectedUtilityItems } from '$lib/stores';
	import { useDataManager } from '$lib/dataManagement/dataManager';
	import {
		calculateInflationRate,
		returnUtilityPrice,
		handleSelectedProductsAndPeriod,
		getSelectedUtilityItemsString
	} from '$lib/utils/helperMethods';

	// Get chart data from stores instead of props
	const dataManager = useDataManager();
	const { foodChartData, utilityChartData } = dataManager;

	let loading: boolean = false;
	let result: FormCalculationResult | null = null;
	let error: string | null = null;
	let fuelAmount: number | string = '';

	// Multi-step form state
	let currentStep: number = 1;
	let totalSteps: number = 2;

	// Form data tracking
	let formData: FormData = createInitialFormData();

	// Simple reactive validation using centralized functions
	$: isStep1Valid = validateStep1(formData);
	$: isStep2Valid = validateStep2(formData);

	// Reactive navigation controls
	$: canProceedToNext = currentStep === 1 ? isStep1Valid : isStep2Valid;
	$: canSubmit = isStep1Valid && isStep2Valid;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!canSubmit) return;

		loading = true;
		error = null;
		result = null;

		const form = event.target as HTMLFormElement;
		const formDataObj = new FormData(form);

		try {
			const response = await fetch('/api/calculate-pp-change', {
				method: 'POST',
				body: formDataObj
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to process form');
			}

			result = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	// Calculate values
	$: inflationRate = calculateInflationRate($foodChartData);
	$: utilityPrice = returnUtilityPrice($utilityChartData);
	$: ({ periodString, productsString } = handleSelectedProductsAndPeriod($foodChartData));
	$: selectedFuelString = fuelItems.find((fuel) => fuel.id === $selectedFuel)?.name;
	$: selectedUtilityItemsString = getSelectedUtilityItemsString($selectedUtilityItems);
</script>

<!-- Form Header -->
<FormHeader {periodString} {productsString} {selectedFuelString} {selectedUtilityItemsString} />

<!-- Multi-step Form -->
<div class="space-y-6">
	<!-- Step Progress Indicator -->
	<ProgressIndicator {currentStep} {isStep1Valid} {isStep2Valid} />

	<!-- Step Titles -->
	<div class="text-center">
		{#if currentStep === 1}
			<h3 class="text-xl font-semibold text-gray-900">Стъпка 1: Месечни доходи</h3>
			<p class="text-gray-600 mt-1">Въведете вашите доходи за избрания период</p>
		{:else if currentStep === 2}
			<h3 class="text-xl font-semibold text-gray-900">Стъпка 2: Месечни разходи</h3>
			<p class="text-gray-600 mt-1">Въведете вашите разходи за различните категории</p>
		{/if}
	</div>

	<!-- Form Content -->
	<form on:submit={handleSubmit} class="space-y-6">
		<!-- Step 1: Income -->
		{#if currentStep === 1}
			<div class="space-y-6">
				<FormField
					fieldName="monthlyBudgetThen"
					bind:value={formData.monthlyBudgetThen}
					disabled={loading}
					containerClass="bg-green-50 border border-green-200"
					iconSvg={svgExporter.greenCheck}
					placeholder="Въведете доходът си в началото на периода"
				/>

				<FormField
					fieldName="monthlyBudgetNow"
					bind:value={formData.monthlyBudgetNow}
					disabled={loading}
					containerClass="bg-green-50 border border-green-200"
					iconSvg={svgExporter.greenCheck}
					placeholder="Въведете текущия си месечен доход"
				/>
			</div>
		{/if}

		<!-- Step 2: Expenses -->
		{#if currentStep === 2}
			<div class="space-y-6">
				<!-- Food Expenses -->
				<FormField
					fieldName="foodExpense"
					bind:value={formData.foodExpense}
					disabled={loading}
					containerClass="bg-orange-50 border border-orange-200"
					iconSvg={svgExporter.orangeCheck}
					placeholder="Въведете месечния разход за храна"
				/>

				<!-- Fuel Expenses -->
				<div class="bg-slate-50 border border-slate-200 rounded-xl p-6">
					<label class="block">
						<div class="flex items-center mb-3">
							{@html svgExporter.fuelIcon}
							<span class="text-lg font-semibold text-slate-900">Разход гориво към днешна дата</span>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-slate-800 mb-2">
									Месечен разход (лв.)
									<input
										class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-700 mt-2"
										type="text"
										inputmode="numeric"
										name="fuel-expense"
										readonly
										disabled
										value={$currentFuelPrice.price !== 0
											? (Number($currentFuelPrice.price) * Number(fuelAmount)).toFixed(2)
											: ''}
										placeholder="Автоматично изчислено"
									/>
								</label>
							</div>
							<div>
								<label class="block text-sm font-medium text-slate-800 mb-2">
									Количество гориво (литри)
									<input
										name="fuel-amount-input"
										type="number"
										class="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 mt-2"
										placeholder="Въведете литри месечно"
										disabled={loading}
										bind:value={fuelAmount}
									/>
								</label>
							</div>
						</div>
						{#if $currentFuelPrice.price === 0 && fuelAmount !== '' && fuelAmount !== null}
							<div class="text-red-600 text-sm mt-2 flex items-center">
								{@html svgExporter.redCheck}
								Моля изберете вид гориво във филтрите по-горе
							</div>
						{/if}
					</label>
				</div>

				<!-- Utility Expenses -->
				<div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
					<div class="flex items-center mb-4">
						{@html svgExporter.purpleCheck}
						<span class="text-lg font-semibold text-purple-900">Разходи за комунални услуги</span>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-4">
							<FormField
								fieldName="electricityExpense"
								bind:value={formData.electricityExpense}
								disabled={loading}
								containerClass="bg-white border-0"
								placeholder="Въведете месечен разход"
							/>
						</div>
						<div class="space-y-4">
							<FormField
								fieldName="waterExpense"
								bind:value={formData.waterExpense}
								disabled={loading}
								containerClass="bg-white border-0"
								placeholder="Въведете месечен разход"
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Hidden Fields for Form Data Persistence -->
		<!-- Step 1 Data Only -->
		<input type="hidden" name="monthly-budget-then" value={formData.monthlyBudgetThen} />
		<input type="hidden" name="monthly-budget-now" value={formData.monthlyBudgetNow} />

		<!-- Calculated Hidden Fields -->
		<input type="hidden" name="inflationRate" value={inflationRate} />
		<input
			type="hidden"
			name="historicalFuelPrice"
			value={$currentFuelPrice.price !== 0 ? $historicalFuelPrice.price : ''}
		/>
		<input
			type="hidden"
			name="electricityHistoricalPrice"
			value={$selectedUtilityItems.includes('electricity')
				? utilityPrice.find((item) => item.id === 'electricity')?.historicalPrice
				: 0}
		/>
		<input
			type="hidden"
			name="electricityCurrentPrice"
			value={$selectedUtilityItems.includes('electricity')
				? utilityPrice.find((item) => item.id === 'electricity')?.currentPrice
				: 0}
		/>
		<input
			type="hidden"
			name="waterHistoricalPrice"
			value={$selectedUtilityItems.includes('water')
				? utilityPrice.find((item) => item.id === 'water')?.historicalPrice
				: 0}
		/>
		<input
			type="hidden"
			name="waterCurrentPrice"
			value={$selectedUtilityItems.includes('water')
				? utilityPrice.find((item) => item.id === 'water')?.currentPrice
				: 0}
		/>
		<input type="hidden" name="fuelAmount" value={fuelAmount !== '' && fuelAmount !== null ? fuelAmount : 0} />
		<input
			type="hidden"
			name="fuel-expense"
			value={$currentFuelPrice.price !== 0
				? (Number($currentFuelPrice.price) * Number(fuelAmount)).toFixed(2)
				: ''}
		/>

		<NavButtons bind:currentStep bind:totalSteps {canProceedToNext} {loading} {canSubmit} />
	</form>
</div>
<!-- Form Results and Errors -->
<FormResultsAndErrors {error} {result} />
