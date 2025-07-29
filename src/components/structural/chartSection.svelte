<script lang="ts">
	import Chart from '../charts/foodChart.svelte';
	import FuelBarChart from '../charts/fuelBarChart.svelte';
	import UtilityChart from '../charts/utilityChart.svelte';
	import { useDataManager } from '$lib/dataManagement/dataManager';
	import { getChartData } from '$lib/dataFetcher/foodDataFetcher';
	import { getFuelBarChartData } from '$lib/dataFetcher/fuelDataFetcher';
	import { getUtilityChartData } from '$lib/dataFetcher/utilityDataFetcher';
	import { selectedFoods, selectedFuel, selectedUtilityItems } from '$lib/stores';

	// Only prop we need is selectedRange since it's shared between components
	export let selectedRange: string;

	// Get data from stores
	const dataManager = useDataManager();
	const {
		loading,
		error,
		foodItems,
		foodChartData,
		fuelChartData,
		utilityChartData,
		setFoodChartData,
		setFuelChartData,
		setUtilityChartData
	} = dataManager;

	// Reactive statement to update chart data when selections change
	$: if (!$loading && $foodItems.length > 0) {
		(selectedRange, $selectedFoods, $selectedUtilityItems, $selectedFuel); // Watch the store values
		updateChartData();
	}

	async function updateChartData() {
		try {
			// Update food chart data
			const newFoodChartData = await getChartData(selectedRange, $selectedFoods);
			setFoodChartData(newFoodChartData);

			// Update fuel chart data
			const newFuelChartData = await getFuelBarChartData(selectedRange, $selectedFuel);
			setFuelChartData(newFuelChartData);

			// Update utility chart data (only for ranges above 1 year)
			const newUtilityChartData = await getUtilityChartData(selectedRange, $selectedUtilityItems);
			setUtilityChartData(newUtilityChartData);
		} catch (err) {
			console.error('Error updating chart data:', err);
		}
	}
</script>

{#if $loading}
	<div class="flex items-center justify-center min-h-[400px]">
		<div class="text-center">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mb-4"
			></div>
			<p class="text-gray-600 font-medium">Loading food price data...</p>
		</div>
	</div>
{:else if $error}
	<div class="flex items-center justify-center min-h-[400px]">
		<div class="text-center">
			<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					></path>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">Error loading data</h3>
			<p class="text-gray-600">Please try refreshing the page</p>
		</div>
	</div>
{:else}
	<!-- Chart Section -->
	<div class="p-8 mb-12">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-white mb-2">Анализатор на потребителските цени</h1>
		</div>

		<!-- Charts Section -->
		<div class="mb-8">
			<div
				class="bg-gray-50 rounded-xl border border-gray-200 p-6 min-h-[300px] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-4"
			>
				<div class="flex flex-col items-center justify-center gap-3 w-full lg:flex-1">
					<div class="chartText mb-4 text-center text-black">
						<h2 class="text-xl font-semibold">Храни</h2>
						<p class="text-sm text-center">Хармонизиран индекс на потребителски цени - (базов) 2015=100</p>
					</div>
					<Chart data={$foodChartData} />
				</div>
				<div class="flex flex-col items-center justify-center gap-3 w-full lg:flex-1">
					<div class="chartText mb-4 text-center text-black">
						<h2 class="text-xl font-semibold">Комунални услуги</h2>
						<p class="text-sm text-center">Графика на цените на комуналните услуги на полугодие.</p>
					</div>
					<UtilityChart data={$utilityChartData} />
				</div>
				<!-- Fuel Chart -->
				<div class="flex flex-col items-center justify-center gap-3 w-full lg:flex-1">
					<div class="chartText mb-4 text-center text-black">
						<h2 class="text-xl font-semibold">Горива</h2>
						<p class="text-sm text-center">Цени на горивата сега и в началото на избрания период.</p>
					</div>
					<FuelBarChart data={$fuelChartData} />
				</div>
			</div>
		</div>
	</div>
{/if}
