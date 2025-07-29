<script lang="ts">
	import { formFields, utilityItems } from '$lib/constants';
	import type { ChartData, FormCalculationResult } from '$lib/interfaces';
	import { selectedFuels, currentFuelPrice, historicalFuelPrice, selectedUtilityItems } from '$lib/stores';
	import { fuelItems } from '$lib/constants';
	import { useDataManager } from '$lib/dataManagement/dataManager';

	// Get chart data from stores instead of props
	const dataManager = useDataManager();
	const { foodChartData, utilityChartData } = dataManager;

	let loading: boolean = false;
	let result: FormCalculationResult | null = null;
	let error: string | null = null;
	let fuelAmount: number | string = '';

	async function handleSubmit(event: Event) {
		event.preventDefault();
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

	function calculateInflationRate(data: ChartData) {
		// Process all datasets for inflation calculations (assuming they are food data)
		return data.datasets.map((dataset) => {
			const values = dataset.data;
			// Calculate the delta between the last and first value (the value is in percentage)
			return (values[values.length - 1] - values[0]) / values[0];
		});
	}

	function returnUtilityPrice(data: ChartData) {
		// Process utility data for utility calculations
		return data.datasets.map((dataset) => {
			const values = dataset.data;
			const id = utilityItems.find((item) => item.name === dataset.label)?.id;
			// Return the first value which is the oldest known price
			return { currentPrice: values[values.length - 1], historicalPrice: values[0], id };
		});
	}

	function handleSelectedProductsAndPeriod(data: ChartData) {
		const period = data.labels.length;
		let periodString = '';
		if (period < 12) {
			periodString = data.labels.length + ' месеца';
		} else if (period === 12) {
			periodString = '1 годинa';
		} else {
			periodString = Math.floor(data.labels.length / 12) + ' години';
		}

		const products = data.datasets;
		let productsString = '';
		productsString = products.map((product) => product.label).join(', ');
		return { periodString, productsString };
	}

	function getSelectedUtilityItemsString(selectedUtilityIds: string[]) {
		return utilityItems
			.filter((item) => selectedUtilityIds.includes(item.id))
			.map((item) => item.name)
			.join(', ');
	}

	// Calculate inflation rate when data changes
	$: inflationRate = calculateInflationRate($foodChartData);
	$: utilityPrice = returnUtilityPrice($utilityChartData);
	// Should selected period, products and fuel on top of the form
	$: ({ periodString, productsString } = handleSelectedProductsAndPeriod($foodChartData));
	$: selectedFuelsString = $selectedFuels
		? fuelItems.find((fuel) => fuel.id === $selectedFuels)?.name
		: 'Не е избрано гориво';
	$: selectedUtilityItemsString = getSelectedUtilityItemsString($selectedUtilityItems);
</script>

<h3 class="text-2xl font-bold mb-2">
	Изчисли промяната в покупателната сила на база избраните продукти и период:
	<span class="text-amber-600 underline text-base mt-2"
		>(Моля използвайте филтрите за да изберете продукти и период)
	</span>
</h3>
<div class="bg-slate-100 border-2 border-gray-200 rounded-md p-2 mb-6">
	<p class="text-amber-600 underline text-base mt-2">Избраният период е: {periodString}</p>
	<p class="text-amber-600 underline text-base mt-2 mb-2">Избрани продукти: {productsString}</p>
	<p class="text-amber-600 underline text-base mt-2 mb-2">Избрано гориво: {selectedFuelsString}</p>
	<p class="text-amber-600 underline text-base mt-2 mb-2">Избрани услуги: {selectedUtilityItemsString}</p>
</div>
<div class="space-y-6">
	<form on:submit={handleSubmit} class="grid grid-cols-1 gap-6 border-2 border-gray-200 rounded-md p-6">
		{#each formFields as field (field.id)}
			{#if field.id.startsWith('monthly-budget')}
				<label class="block">
					<span class="text-gray-700 text-lg">{field.label} *</span>
					<input
						class="bg-gray-50 mt-0 block w-1/2 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
						type={field.type}
						inputmode="numeric"
						id={field.id}
						name={field.id}
						required
						disabled={loading}
					/>
				</label>
			{:else if field.id.startsWith('fuel-expense')}
				<label class="block">
					<span class="text-gray-700 text-lg">{field.label}</span>
					<div class="flex gap-4 mt-2">
						<input
							class="bg-gray-50 block w-1/2 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
							type={field.type}
							inputmode="numeric"
							id={field.id}
							name={field.id}
							readonly
							value={$currentFuelPrice.price !== 0
								? (Number($currentFuelPrice.price) * Number(fuelAmount)).toFixed(2)
								: ''}
						/>
						<input
							id="fuel-amount-input"
							name="fuel-amount-input"
							type="number"
							class="bg-gray-50 w-1/2 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
							placeholder="Въведете количество гориво в литри"
							disabled={loading}
							bind:value={fuelAmount}
						/>
					</div>
					{#if $currentFuelPrice.price === 0 && fuelAmount !== '' && fuelAmount !== null}
						<div class="text-red-600 text-sm mt-1">Моля изберете вид гориво</div>
					{/if}
				</label>
			{:else}
				<label class="block">
					{#if field.id.startsWith('food-expense')}
						<span class="text-gray-700 text-lg">{field.label} *</span>
					{:else}
						<span class="text-gray-700 text-lg">{field.label}</span>
					{/if}
					<input
						class="bg-gray-50 mt-0 block w-1/2 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
						type={field.type}
						inputmode="numeric"
						id={field.id}
						name={field.id}
						disabled={loading}
					/>
				</label>
			{/if}
		{/each}
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
		<button
			type="submit"
			class="bg-slate-800 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={loading}
		>
			{loading ? 'Calculating...' : 'Submit'}
		</button>
	</form>

	{#if error}
		<div class="bg-red-50 border border-red-200 rounded-md p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<div class="mt-2 text-sm text-red-700">
						{error}
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if result}
		<div class="bg-green-50 border border-green-200 rounded-md p-6">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3 flex-1">
					<h3 class="text-lg font-medium text-green-800 mb-4">
						Анализ на покупателната сила и ефектите от инфлацията
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">Месечен доход към днешна дата</div>
							<div class="text-green-600 font-semibold">{result.monthlyBudget.toFixed(2)} лв.</div>
						</div>
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">Месечен доход в началото на периода</div>
							<div class="text-green-600 font-semibold">
								{result.monthlyBudgetThen.toFixed(2)} лв.
							</div>
						</div>
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">Разход към днешна дата</div>
							<div class="text-red-600 font-semibold">{result.totalExpensesNow.toFixed(2)} лв.</div>
						</div>
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">Разход в началото на периода</div>
							<div class="text-gray-900 font-normal text-sm italic mt-2 mb-2">
								Това е сумата на днешния разход преизчислена към цените и инфлацията от началото на
								периода. Тоест каква е била цената на същите продукти тогава.
							</div>
							<div class="text-red-600 font-semibold">
								{result.totalExpensesThen.toFixed(2)} лв.
							</div>
						</div>
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">Разполагаем доход към днешна дата</div>
							<div class="text-gray-900 font-normal text-sm italic mt-2 mb-2">
								Това е нетната сума, след приспадане на разходите.
							</div>
							<div class="text-blue-600 font-semibold">
								{result.currentDisposableIncome.toFixed(2)} лв.
							</div>
						</div>
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">Разполагаем доход в началото на периода</div>
							<div class="text-gray-900 font-normal text-sm italic mt-2 mb-2">
								Това е нетната сума, след приспадане на разходите.
							</div>
							<div class="text-blue-600 font-semibold">
								{result.previousDisposableIncome.toFixed(2)} лв.
							</div>
						</div>
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">Процент на инфлацията</div>
							<div class="text-gray-900 font-normal text-sm italic mt-2 mb-2">
								Осреднен процент на инфлацията за избрания период на база избраните продукти.
							</div>
							<div class="text-orange-600 font-semibold">{result.inflationRate.toFixed(2)}%</div>
						</div>
						<div class="bg-white p-3 rounded border">
							<div class="font-medium text-gray-900">
								Нетна разлика в разходите (приравнени към днешна дата)
							</div>
							<div class="text-gray-900 font-normal text-sm italic mt-2 mb-2">
								Положителна стойност означава, че разходите са се увеличили, а отрицателна означава, че
								са се смалили.
							</div>
							{#if result.netExpensesDifference > 0}
								<div class="text-red-600 font-semibold">
									{result.netExpensesDifference.toFixed(2)} лв.
								</div>
							{:else}
								<div class="text-green-600 font-semibold">
									{result.netExpensesDifference.toFixed(2)} лв.
								</div>
							{/if}
						</div>
					</div>
					<div class="bg-white p-3 mt-4 rounded border">
						<div class="font-medium text-gray-900">
							Сравнение на покупателната сила на дохода в началото на периода и днешния доход
						</div>
						<div class="text-gray-900 font-normal text-sm italic mt-2 mb-2">
							Сумата, която изписва показва разликата в покупателната сила между днешния доход и дохода в
							началото на периода. Базира се на потребителската кошница - избраните продукти и разходи към
							днешна дата. Ако новата заплата изпреварва инфлацията, ще е маркирана в зелено, ако изостава
							- в червено.
						</div>
						<div class="text-slate-600 font-bold text-sm italic mt-2 mb-2">
							Доход в началото на периода, който е със същата покупателна сила, като днешния:
							{result.previousSalaryValueMatchingCurrentPurchasingPower.toFixed(2)} лв.
						</div>
						{#if result.previousSalaryValueMatchingCurrentPurchasingPower > result.monthlyBudgetThen}
							<div class="text-green-600 font-semibold border-2 border-green-600 rounded-md p-2 mb-2">
								Покупателната сила на настоящия доход е по-голяма с {(
									result.previousSalaryValueMatchingCurrentPurchasingPower - result.monthlyBudgetThen
								).toFixed(2)} лв.
							</div>
						{:else}
							<div class="text-red-600 font-semibold border-2 border-red-600 rounded-md p-2 mb-2">
								Покупателната сила на настоящия доход е по-малка с {(
									result.monthlyBudgetThen - result.previousSalaryValueMatchingCurrentPurchasingPower
								).toFixed(2)} лв.
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
