<script lang="ts">
	import type { FuelItem } from '$lib/interfaces';
	import { selectedFuels, fuelStore, currentFuelPrice, historicalFuelPrice } from '$lib/stores';
	import { getFuelData } from '$lib/dataFetcher/fuelDataFetcher';
	import { getDateFromRange } from '$lib/utils/dateFromRange';

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
		// Using CA as hack to not do stupid string splits, reversing etc, due to the format of the API
		const formattedDate = now.toLocaleDateString('en-CA');
		const data = await getFuelData({ fuelType: fuelItemId, date: formattedDate });
		currentFuelPrice.set(data);
	}

	async function handleHistoricalPrice(fuelItemId: string, selectedRange: string) {
		const dateInPast = getDateFromRange(selectedRange);
		const formattedDate = dateInPast?.toLocaleDateString('en-CA');
		if (!formattedDate) throw new Error('Invalid date');
		const data = await getFuelData({ fuelType: fuelItemId, date: formattedDate });
		historicalFuelPrice.set(data);
	}

	$: if ($selectedFuels) {
		handlePriceUpdate($selectedFuels);
		handleHistoricalPrice($selectedFuels, selectedRange);
	} else {
		fuelStore.clear();
		currentFuelPrice.set(zeroFuelData);
		historicalFuelPrice.set(zeroFuelData);
	}
</script>

<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
	<h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">Списък с горива</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
		{#each fuelItems as fuel (fuel.id)}
			<button
				class="relative px-4 py-4 text-center min-h-20 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 {$selectedFuels.includes(
					fuel.id
				)
					? 'bg-green-50 border-green-200 text-green-900 shadow-sm'
					: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}"
				on:click={() => handleFuelSelect(fuel)}
			>
				<div class="font-medium text-sm">{fuel.name}</div>
				{#if $selectedFuels.includes(fuel.id)}
					<div class="absolute top-2 right-2 w-2 h-2 bg-green-600 rounded-full"></div>
					<div class="text-sm text-gray-500">
						{#if $currentFuelPrice.price !== 0}
							{$currentFuelPrice.price} {$currentFuelPrice.dimension}
						{:else}
							-
						{/if}
					</div>
				{/if}
			</button>
		{/each}
		<div
			class="relative px-4 py-4 text-center min-h-20 rounded-xl border transition-all duration-200 bg-gray-50 border-gray-200 text-gray-700 flex flex-col items-center justify-center"
		>
			<div class="font-medium text-sm">Цена в началото на избрания период</div>
			<div class="text-sm text-gray-500 mt-1">
				{#if $historicalFuelPrice.price !== 0}
					{$historicalFuelPrice.price} {$historicalFuelPrice.dimension}
				{:else}
					-
				{/if}
			</div>
		</div>
	</div>
</div>
