<script lang="ts">
	import type { FoodItem } from '$lib/interfaces';
	import { selectedFoods, foodStore } from '$lib/stores';
	import { appDefaults } from '$lib/constants';

	export let foodItems: FoodItem[] = [];

	function handleFoodSelect(foodId: string) {
		foodStore.toggle(foodId);
	}
</script>

<div class="glass-card rounded-2xl p-6 smooth-transition hover:shadow-lg">
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center">
			<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
				<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-2.5M21 21l-2.5-2.5"
					></path>
				</svg>
			</div>
			<div>
				<h3 class="text-xl font-semibold text-gray-900">Хранителни продукти</h3>
				<p class="text-sm text-gray-600">Изберете продукти за анализ</p>
			</div>
		</div>
		<div class="text-right">
			<div class="text-sm font-medium text-gray-900">{$selectedFoods.length}/{foodItems.length}</div>
			<div class="text-xs text-gray-500">Избрани</div>
		</div>
	</div>

	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
		{#each foodItems as food (food.id)}
			<button
				class="relative px-3 py-3 text-center rounded-lg border smooth-transition focus-enhanced group {$selectedFoods.includes(
					food.id
				)
					? 'bg-green-50 border-green-200 text-green-900 shadow-sm ring-2 ring-green-500 ring-opacity-20'
					: 'bg-white border-gray-200 text-gray-700 hover-slate hover:shadow-sm'}"
				on:click={() => handleFoodSelect(food.id)}
			>
				<div class="text-sm font-medium leading-tight">{food.name}</div>

				<!-- Selection indicator -->
				<div class="absolute top-2 right-2 flex items-center justify-center">
					{#if $selectedFoods.includes(food.id)}
						<div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
							<svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"
								></path>
							</svg>
						</div>
					{:else}
						<div
							class="w-4 h-4 border-2 border-gray-300 rounded-full group-hover:border-gray-400 transition-colors"
						></div>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	<!-- Quick Actions -->
	<div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
		<button
			on:click={() => foodStore.set(foodItems.map((f) => f.id))}
			class="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
		>
			Избери всички
		</button>
		<button
			on:click={() => foodStore.set(appDefaults.foods)}
			class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
		>
			Възстанови по подразбиране
		</button>
	</div>
</div>
