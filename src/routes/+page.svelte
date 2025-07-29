<script lang="ts">
	import { onMount } from 'svelte';
	import type { FoodItem, ChartData, FuelItem, UtilityItem, FuelBarChartData } from '$lib/interfaces';
	import Chart from '../components/charts/chart.svelte';
	import FuelBarChart from '../components/charts/fuelBarChart.svelte';
	import UtilityChart from '../components/charts/utilityChart.svelte';
	import Form from '../components/main/Form.svelte';
	import DateRange from '../components/main/dateRange.svelte';
	import FoodItems from '../components/main/foodItems.svelte';
	import FuelItems from '../components/main/fuelItems.svelte';
	import UtilityItems from '../components/main/utilityItems.svelte';
	import {
		selectedFoods,
		foodStore,
		selectedFuels,
		fuelStore,
		selectedUtilityItems,
		utilityStore
	} from '$lib/stores';
	import { getChartData, getFoodItems } from '$lib/dataFetcher/foodDataFetcher';
	import { getFuelItems, getFuelBarChartData } from '$lib/dataFetcher/fuelDataFetcher';
	import { getUtilityChartData } from '$lib/dataFetcher/utilityDataFetcher';
	import HeaderImage from '$lib/assets/header-image.webp';
	import { utilityItems as utilityItemsConstants } from '$lib/constants';

	let loading = true;
	let error = false;
	let foodItems: FoodItem[] = [];
	let fuelItems: FuelItem[] = [];
	let utilityItems: UtilityItem[] = utilityItemsConstants;
	const defaults = {
		range: '3months',
		foods: ['bread'],
		fuels: ['gasoline'],
		utilities: ['electricity']
	};

	let selectedRange = defaults.range;
	let foodChartData: ChartData = { labels: [], datasets: [] };
	let fuelChartData: FuelBarChartData = { labels: [], datasets: [] };
	let utilityChartData: ChartData = { labels: [], datasets: [] };

	onMount(async () => {
		try {
			loading = true;
			// Load food items first
			foodItems = await getFoodItems();
			fuelItems = await getFuelItems();
			// Set default selection to first available food if bread is not available
			if (foodItems.length > 0 && !foodItems.find((f) => f.id === 'bread')) {
				foodStore.set([foodItems[0].id]);
			} else {
				foodStore.set(defaults.foods);
			}
			fuelStore.set(defaults.fuels[0]);
			utilityStore.set(defaults.utilities[0]);

			// Load initial chart data for all charts
			// await updateChartData();
		} catch (err) {
			console.error('Error loading data:', err);
			error = true;
		} finally {
			loading = false;
		}
	});

	// Reactive statement to update chart data when selections change
	$: if (!loading && foodItems.length > 0) {
		(selectedRange, $selectedFoods, $selectedUtilityItems, $selectedFuels); // Watch the store value, not the store object
		updateChartData();
	}

	async function updateChartData() {
		try {
			// Update food chart data
			foodChartData = await getChartData(selectedRange, $selectedFoods);

			// Update fuel chart data
			fuelChartData = await getFuelBarChartData(selectedRange, $selectedFuels ? [$selectedFuels] : []);

			// Update utility chart data (only for ranges above 1 year)
			utilityChartData = await getUtilityChartData(selectedRange, $selectedUtilityItems);
		} catch (err) {
			console.error('Error updating chart data:', err);
			error = true;
		}
	}

	function resetToDefaults() {
		if (
			selectedRange !== defaults.range ||
			$selectedFuels !== defaults.fuels[0] ||
			$selectedUtilityItems !== defaults.utilities ||
			$selectedFoods.length !== defaults.foods.length ||
			!defaults.foods.every((f) => $selectedFoods.includes(f))
		) {
			selectedRange = defaults.range;
			foodStore.set(defaults.foods);
			utilityStore.set(defaults.utilities[0]);
			fuelStore.set(defaults.fuels[0]);
		}
	}
</script>

<main class="main-content flex-1 pb-8 min-h-screen">
	<!-- Hero Section with Background Image -->
	<div
		class="overlay-image relative"
		style="background-image: url({HeaderImage}); background-size: cover; background-position: center;"
	>
		<div class="max-w-7xl mx-auto chart-container">
			{#if loading}
				<div class="flex items-center justify-center min-h-[400px]">
					<div class="text-center">
						<div
							class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mb-4"
						></div>
						<p class="text-gray-600 font-medium">Loading food price data...</p>
					</div>
				</div>
			{:else if error}
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
									<p class="text-sm text-center">
										Хармонизиран индекс на потребителски цени - (базов) 2015=100
									</p>
								</div>
								<Chart data={foodChartData} />
							</div>
							<div class="flex flex-col items-center justify-center gap-3 w-full lg:flex-1">
								<div class="chartText mb-4 text-center text-black">
									<h2 class="text-xl font-semibold">Комунални услуги</h2>
									<p class="text-sm text-center">
										Графика на цените на комуналните услуги на полугодие.
									</p>
								</div>
								<UtilityChart data={utilityChartData} />
							</div>
							<!-- Fuel Chart -->
							<div class="flex flex-col items-center justify-center gap-3 w-full lg:flex-1">
								<div class="chartText mb-4 text-center text-black">
									<h2 class="text-xl font-semibold">Горива</h2>
									<p class="text-sm text-center">
										Цени на горивата сега и в началото на избрания период.
									</p>
								</div>
								<FuelBarChart data={fuelChartData} />
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Controls Section - Overlapping with the overlay -->
		{#if !loading && !error}
			<div class="controls-overlap">
				<div class="max-w-7xl mx-auto px-6 space-y-8">
					<DateRange bind:selectedRange />
					<FoodItems {foodItems} />
					<FuelItems {fuelItems} bind:selectedRange />
					<UtilityItems {utilityItems} />
					<div class="flex justify-center pt-4 pb-8">
						<button
							class="inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							on:click={resetToDefaults}
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								></path>
							</svg>
							Изчисти селекцията
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div class="max-w-4xl mx-auto px-6">
		<Form data={foodChartData} utilityData={utilityChartData} />
	</div>
</main>
