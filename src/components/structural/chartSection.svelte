<script lang="ts">
	import Chart from '../charts/foodChart.svelte';
	import FuelBarChart from '../charts/fuelBarChart.svelte';
	import UtilityChart from '../charts/utilityChart.svelte';
	import LoadingChartState from './loadingChartState.svelte';
	import ErrorChartState from './errorChartState.svelte';
	import FoodInfoModal from './informationModals/foodInfoModal.svelte';
	import UtilityModal from './informationModals/utilityModal.svelte';
	import FuelInfoModal from './informationModals/fuelInfoModal.svelte';
	import { useDataManager } from '$lib/dataManagement/dataManager';
	import { getChartData } from '$lib/dataFetcher/foodDataFetcher';
	import { getFuelBarChartData } from '$lib/dataFetcher/fuelDataFetcher';
	import { getUtilityChartData } from '$lib/dataFetcher/utilityDataFetcher';
	import { selectedFoods, selectedFuel, selectedUtilityItems } from '$lib/stores';
	import { svgExporter } from '$lib/assets/svgExporter';
	// Only prop we need is selectedRange since it's shared between components
	export let selectedRange: string;

	// State for information modals
	let showFoodInfo = false;
	let showUtilityInfo = false;
	let showFuelInfo = false;

	// Get data from stores
	const dataManager = useDataManager();
	const { loading, error, foodItems, foodChartData, fuelChartData, utilityChartData, setFoodChartData, setFuelChartData, setUtilityChartData } =
		dataManager;

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

	// Modal handlers
	function openFoodInfo() {
		showFoodInfo = true;
	}

	function openUtilityInfo() {
		showUtilityInfo = true;
	}

	function openFuelInfo() {
		showFuelInfo = true;
	}

	function closeModal() {
		showFoodInfo = false;
		showUtilityInfo = false;
		showFuelInfo = false;
	}

	// Close modal on escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $loading}
	<LoadingChartState />
{:else if $error}
	<ErrorChartState />
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
						on:click={openFoodInfo}
					>
						{@html svgExporter.infoIcon}
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
						on:click={openUtilityInfo}
					>
						{@html svgExporter.infoIcon}
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
						on:click={openFuelInfo}
					>
						{@html svgExporter.infoIcon}
					</button>
				</div>
			</div>
			<div class="h-64 flex items-center justify-center">
				<FuelBarChart data={$fuelChartData} />
			</div>
		</div>
	</div>
{/if}

<!-- Information Modals -->
<!-- Food Info Modal -->
{#if showFoodInfo}
	<FoodInfoModal {closeModal} />
{/if}

<!-- Utility Info Modal -->
{#if showUtilityInfo}
	<UtilityModal {closeModal} />
{/if}

<!-- Fuel Info Modal -->
{#if showFuelInfo}
	<FuelInfoModal {closeModal} />
{/if}
