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
	import { appDefaults, fuelItems as fuelItemsConstants } from '$lib/constants';

	function resetToDefaults() {
		selectedRange = appDefaults.range;
		foodStore.set(appDefaults.foods);
		utilityStore.set(appDefaults.utilities);
		fuelStore.set(appDefaults.fuel);
	}

	// Calculate selection counts for badges
	$: selectedCount = {
		foods: $selectedFoods.length,
		totalFoods: $foodItems.length,
		utilities: $selectedUtilityItems.length
	};
</script>

<!-- Enhanced Controls Section -->
{#if !$loading && !$error}
	<div class="controls-overlap pb-10">
		<div class="max-w-7xl mx-auto px-6">
			<!-- Filter Header -->
			<div class="text-center mb-10">
				<h2 class="text-2xl md:text-3xl font-bold text-white mb-3">Конфигурирайте анализа</h2>
				<p class="text-base md:text-lg text-white max-w-2xl mx-auto">
					Изберете времеви период, продукти и услуги за анализ на промените в покупателната сила
				</p>
			</div>
			<!-- Selection Summary & Reset -->
			<div class="glass-card rounded-2xl p-6 mb-6">
				<div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
					<!-- Selection Summary -->
					<div class="flex flex-wrap items-center gap-4">
						<h3 class="text-lg font-semibold text-gray-900">Текущ избор:</h3>
						<div class="flex flex-wrap gap-3">
							<span
								class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800"
							>
								<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									></path>
								</svg>
								{selectedRange}
							</span>
							{#if selectedCount.foods > 0}
								<span
									class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
								>
									<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-2.5M21 21l-2.5-2.5"
										></path>
									</svg>
									{selectedCount.foods}/{selectedCount.totalFoods} Храни
								</span>
							{/if}
							<span
								class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
							>
								<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									></path>
								</svg>
								{fuelItemsConstants.find((item) => item.id === $selectedFuel)?.name}
							</span>
							{#if selectedCount.utilities > 0}
								<span
									class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
								>
									<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										></path>
									</svg>
									{selectedCount.utilities} Услуги
								</span>
							{/if}
						</div>
					</div>

					<!-- Reset Button -->
					<button
						class="inline-flex items-center px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium shadow-sm hover:bg-slate-100 hover:border-slate-300 focus-enhanced smooth-transition"
						on:click={resetToDefaults}
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							></path>
						</svg>
						Възстанови по подразбиране
					</button>
				</div>
			</div>

			<!-- Improved Filters Grid Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<DateRange bind:selectedRange />

				<FoodItems foodItems={$foodItems} />

				<FuelItems fuelItems={$fuelItems} bind:selectedRange />

				<UtilityItems utilityItems={$utilityItems} />
			</div>
		</div>
	</div>
{/if}
