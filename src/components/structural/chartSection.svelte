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
	<div class="flex items-center justify-center min-h-[500px]">
		<div class="text-center">
			<div class="relative">
				<div
					class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mb-6"
				></div>
				<div
					class="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-spin"
					style="animation-delay: 0.15s;"
				></div>
			</div>
			<p class="text-white/90 font-medium text-lg">Loading price data...</p>
			<p class="text-white/70 text-sm mt-2">Fetching latest economic indicators</p>
		</div>
	</div>
{:else if $error}
	<div class="flex items-center justify-center min-h-[500px]">
		<div class="text-center max-w-md">
			<div
				class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
			>
				<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					></path>
				</svg>
			</div>
			<h3 class="text-xl font-semibold text-white mb-3">Unable to load data</h3>
			<p class="text-white/80 mb-4">There was an issue fetching the latest price information</p>
			<button
				class="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-200"
			>
				Try Again
			</button>
		</div>
	</div>
{:else}
	<!-- Modern Charts Section -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
		<!-- Food Prices Chart -->
		<div class="glass-card rounded-2xl p-6 smooth-transition hover:shadow-xl">
			<div class="flex items-center justify-between mb-6">
				<div>
					<h3 class="text-xl font-bold text-gray-900 flex items-center">
						<span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
						Храни
					</h3>
					<p class="text-sm text-gray-600 mt-1">Хармонизиран индекс на потребителските цени (2015=100)</p>
				</div>
				<div class="flex space-x-2">
					<button
						class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
						title="Информация за диаграмата"
						aria-label="Информация за диаграмата"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</button>
				</div>
			</div>
			<div class="h-64 flex items-center justify-center">
				<Chart data={$foodChartData} />
			</div>
		</div>

		<!-- Utilities Chart -->
		<div class="glass-card rounded-2xl p-6 smooth-transition hover:shadow-xl">
			<div class="flex items-center justify-between mb-6">
				<div>
					<h3 class="text-xl font-bold text-gray-900 flex items-center">
						<span class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
						Комунални услуги
					</h3>
					<p class="text-sm text-gray-600 mt-1">Цени на избраните услуги с периодичност 6 месеца</p>
				</div>
				<div class="flex space-x-2">
					<button
						class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
						title="Информация за диаграмата"
						aria-label="Информация за диаграмата"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</button>
				</div>
			</div>
			<div class="h-64 flex items-center justify-center">
				<UtilityChart data={$utilityChartData} />
			</div>
		</div>

		<!-- Fuel Chart -->
		<div class="glass-card rounded-2xl p-6 smooth-transition hover:shadow-xl">
			<div class="flex items-center justify-between mb-6">
				<div>
					<h3 class="text-xl font-bold text-gray-900 flex items-center">
						<span class="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
						Горива
					</h3>
					<p class="text-sm text-gray-600 mt-1">Текуща и историческа цена на избраното гориво</p>
				</div>
				<div class="flex space-x-2">
					<button
						class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
						title="Информация за диаграмата"
						aria-label="Информация за диаграмата"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</button>
				</div>
			</div>
			<div class="h-64 flex items-center justify-center">
				<FuelBarChart data={$fuelChartData} />
			</div>
		</div>
	</div>
{/if}
