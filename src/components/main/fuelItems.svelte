<script lang="ts">
	import type { FuelItem } from '$lib/interfaces';
	import { selectedFuel, fuelStore, currentFuelPrice, historicalFuelPrice } from '$lib/stores';
	import { getFuelData } from '$lib/dataFetcher/fuelDataFetcher';
	import { getDateFromRange } from '$lib/utils/datesAndRanges';

	export let selectedRange: string;

	const zeroFuelData = {
		fuel: '',
		price: 0,
		dimension: '',
		date: ''
	};

	export let fuelItems: FuelItem[] = [];

	async function handleFuelSelect(fuelItem: FuelItem) {
		fuelStore.toggle(fuelItem.id);
	}

	async function handlePriceUpdate(fuelItemId: string) {
		const now = new Date();
		const formattedDate = now.toLocaleDateString('en-CA');
		const data = await getFuelData({ fuelType: fuelItemId, date: formattedDate });
		currentFuelPrice.set(data);
	}

	async function handleHistoricalPrice(fuelItemId: string, selectedRange: string) {
		const startDate = getDateFromRange(selectedRange);
		if (!startDate) throw new Error('Invalid date range');
		const formattedDate = startDate.toLocaleDateString('en-CA');
		const data = await getFuelData({ fuelType: fuelItemId, date: formattedDate });
		historicalFuelPrice.set(data);
	}

	$: if ($selectedFuel) {
		handlePriceUpdate($selectedFuel);
		handleHistoricalPrice($selectedFuel, selectedRange);
	} else {
		currentFuelPrice.set(zeroFuelData);
		historicalFuelPrice.set(zeroFuelData);
	}
</script>

<div class="glass-card rounded-2xl p-6 smooth-transition hover:shadow-lg">
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center">
			<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
				<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
				</svg>
			</div>
			<div>
				<h3 class="text-xl font-semibold text-gray-900">Видове горива</h3>
				<p class="text-sm text-gray-600">Изберете гориво за анализ</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
		{#each fuelItems as fuel (fuel.id)}
			<button
				class="w-full relative px-4 py-4 text-left rounded-xl border smooth-transition focus-enhanced group {$selectedFuel === fuel.id
					? 'bg-blue-50 border-blue-200 text-blue-900 ring-2 ring-blue-500 ring-opacity-20 shadow-sm'
					: 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm'}"
				on:click={() => handleFuelSelect(fuel)}
			>
				<div class="flex items-center justify-between">
					<div>
						<div class="font-medium">{fuel.name}</div>
					</div>
					{#if $selectedFuel === fuel.id}
						<div class="flex items-center">
							<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
					{:else}
						<div class="w-4 h-4 border-2 border-gray-300 rounded-full group-hover:border-gray-400 transition-colors"></div>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	{#if $selectedFuel && $currentFuelPrice.price}
		<div class="mt-4 pt-4 border-t border-blue-100">
			<div>
				<div class="text-xs font-medium text-blue-800 uppercase tracking-wide mb-2">Ценова информация</div>
				<div class="grid grid-cols-2 gap-3 text-sm">
					<div class="bg-blue-50 rounded-lg p-3">
						<div class="text-blue-600 font-medium">Текуща</div>
						<div class="text-blue-900 font-semibold">{$currentFuelPrice.price.toFixed(2)} лв./л</div>
					</div>
					{#if $historicalFuelPrice.price}
						<div class="bg-gray-50 rounded-lg p-3">
							<div class="text-gray-600 font-medium">В началото на периода</div>
							<div class="text-gray-900 font-semibold">{$historicalFuelPrice.price.toFixed(2)} лв./л</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
