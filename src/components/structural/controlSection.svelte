<script lang="ts">
	// Only prop we need is selectedRange since it's shared between components
	export let selectedRange: string;

	// Import control components
	import DateRange from '../main/dateRange.svelte';
	import FoodItems from '../main/foodItems.svelte';
	import FuelItems from '../main/fuelItems.svelte';
	import UtilityItems from '../main/utilityItems.svelte';

	// Get data from stores
	import { useDataManager } from '$lib/dataManagement/dataManager';
	const dataManager = useDataManager();
	const { loading, error, foodItems, fuelItems, utilityItems } = dataManager;

	// Import stores and constants for reset functionality
	import { selectedFoods, selectedFuel, selectedUtilityItems, foodStore, fuelStore, utilityStore } from '$lib/stores';
	import { appDefaults } from '$lib/constants';

	function resetToDefaults() {
		if (
			selectedRange !== appDefaults.range ||
			$selectedFuel !== appDefaults.fuels[0] ||
			$selectedUtilityItems !== appDefaults.utilities ||
			$selectedFoods.length !== appDefaults.foods.length ||
			!appDefaults.foods.every((f) => $selectedFoods.includes(f))
		) {
			selectedRange = appDefaults.range;
			foodStore.set(appDefaults.foods);
			utilityStore.set(appDefaults.utilities[0]);
			fuelStore.set(appDefaults.fuels[0]);
		}
	}
</script>

<!-- Controls Section - Overlapping with the overlay -->
{#if !$loading && !$error}
	<div class="controls-overlap">
		<div class="max-w-7xl mx-auto px-6 space-y-8">
			<DateRange bind:selectedRange />
			<FoodItems foodItems={$foodItems} />
			<FuelItems fuelItems={$fuelItems} bind:selectedRange />
			<UtilityItems utilityItems={$utilityItems} />
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
					Върни по подразбиране
				</button>
			</div>
		</div>
	</div>
{/if}
