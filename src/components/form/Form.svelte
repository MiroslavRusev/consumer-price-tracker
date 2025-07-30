<script lang="ts">
	import NavButtons from './navButtons.svelte';
	import FormHeader from './formHeader.svelte';
	import FormResultsAndErrors from './formResultsAndErrors.svelte';
	import ProgressIndicator from './progressIndicator.svelte';
	import { fuelItems } from '$lib/constants';
	import { createInitialFormData } from '$lib/utils/formDataBuilder';
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

	// Reactive validation for each field
	$: monthlyBudgetThenValid = formData.monthlyBudgetThen.trim() !== '' && !isNaN(Number(formData.monthlyBudgetThen));
	$: monthlyBudgetNowValid = formData.monthlyBudgetNow.trim() !== '' && !isNaN(Number(formData.monthlyBudgetNow));
	$: foodExpenseValid = formData.foodExpense.trim() !== '' && !isNaN(Number(formData.foodExpense));

	// Reactive validation for each step
	$: isStep1Valid = monthlyBudgetThenValid && monthlyBudgetNowValid;
	$: isStep2Valid = foodExpenseValid;

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
				<div class="bg-green-50 border border-green-200 rounded-xl p-6">
					<label class="block">
						<div class="flex items-center mb-3">
							<svg
								class="w-5 h-5 text-green-600 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
								></path>
							</svg>
							<span class="text-lg font-semibold text-green-900">Месечен доход в началото на периода</span
							>
						</div>
						<input
							bind:value={formData.monthlyBudgetThen}
							class="w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-lg {formData.monthlyBudgetThen.trim() ===
							''
								? 'border-green-300 focus:ring-green-500'
								: monthlyBudgetThenValid
									? 'border-green-500 focus:ring-green-500'
									: 'border-red-300 focus:ring-red-500'}"
							type="text"
							inputmode="numeric"
							placeholder="Въведете доходът си в началото на периода"
							required
							disabled={loading}
						/>
						{#if formData.monthlyBudgetThen.trim() !== '' && monthlyBudgetThenValid}
							<div class="flex items-center mt-2 text-green-600 text-sm">
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								Валидно
							</div>
						{/if}
					</label>
				</div>

				<div class="bg-green-50 border border-green-200 rounded-xl p-6">
					<label class="block">
						<div class="flex items-center mb-3">
							<svg
								class="w-5 h-5 text-green-600 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
								></path>
							</svg>
							<span class="text-lg font-semibold text-green-900">Месечен доход към днешна дата</span>
						</div>
						<input
							bind:value={formData.monthlyBudgetNow}
							class="w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-lg {formData.monthlyBudgetNow.trim() ===
							''
								? 'border-green-300 focus:ring-green-500'
								: monthlyBudgetNowValid
									? 'border-green-500 focus:ring-green-500'
									: 'border-red-300 focus:ring-red-500'}"
							type="text"
							inputmode="numeric"
							placeholder="Въведете текущия си месечен доход"
							required
							disabled={loading}
						/>
						{#if formData.monthlyBudgetNow.trim() !== '' && monthlyBudgetNowValid}
							<div class="flex items-center mt-2 text-green-600 text-sm">
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								Валидно
							</div>
						{/if}
					</label>
				</div>
			</div>
		{/if}

		<!-- Step 2: Expenses -->
		{#if currentStep === 2}
			<div class="space-y-6">
				<!-- Food Expenses -->
				<div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
					<label class="block">
						<div class="flex items-center mb-3">
							<svg
								class="w-5 h-5 text-orange-600 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-2.5M21 21l-2.5-2.5"
								></path>
							</svg>
							<span class="text-lg font-semibold text-orange-900">Разход храна към днешна дата</span>
						</div>
						<input
							bind:value={formData.foodExpense}
							class="w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-lg {formData.foodExpense.trim() ===
							''
								? 'border-orange-300 focus:ring-orange-500'
								: foodExpenseValid
									? 'border-green-500 focus:ring-green-500'
									: 'border-red-300 focus:ring-red-500'}"
							type="text"
							inputmode="numeric"
							name="food-expense"
							placeholder="Въведете месечния разход за храна"
							required
							disabled={loading}
						/>
						{#if formData.foodExpense.trim() !== '' && foodExpenseValid}
							<div class="flex items-center mt-2 text-green-600 text-sm">
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								Валидно
							</div>
						{/if}
					</label>
				</div>

				<!-- Fuel Expenses -->
				<div class="bg-slate-50 border border-slate-200 rounded-xl p-6">
					<label class="block">
						<div class="flex items-center mb-3">
							<svg
								class="w-5 h-5 text-slate-600 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								></path>
							</svg>
							<span class="text-lg font-semibold text-slate-900">Разход гориво към днешна дата</span>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-slate-800 mb-2">
									Месечен разход (лв.)
									<input
										class="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 mt-2"
										type="text"
										inputmode="numeric"
										name="fuel-expense"
										readonly
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
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									></path>
								</svg>
								Моля изберете вид гориво във филтрите по-горе
							</div>
						{/if}
					</label>
				</div>

				<!-- Utility Expenses -->
				<div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
					<div class="flex items-center mb-4">
						<svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span class="text-lg font-semibold text-purple-900">Разходи за комунални услуги</span>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label class="block">
							<span class="text-sm font-medium text-purple-800 mb-2 block"
								>Разход електричество към днешна дата</span
							>
							<input
								bind:value={formData.electricityExpense}
								class="w-full px-4 py-3 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
								type="text"
								inputmode="numeric"
								name="electricity-expense"
								placeholder="Въведете месечен разход"
								disabled={loading}
							/>
						</label>
						<label class="block">
							<span class="text-sm font-medium text-purple-800 mb-2 block"
								>Разход вода към днешна дата</span
							>
							<input
								bind:value={formData.waterExpense}
								class="w-full px-4 py-3 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
								type="text"
								inputmode="numeric"
								name="water-expense"
								placeholder="Въведете месечен разход"
								disabled={loading}
							/>
						</label>
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

		<NavButtons bind:currentStep bind:totalSteps {canProceedToNext} {loading} {canSubmit} />
	</form>
</div>
<!-- Form Results and Errors -->
<FormResultsAndErrors {error} {result} />
