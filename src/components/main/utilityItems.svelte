<script lang="ts">
	import { selectedUtilityItems, utilityStore } from '$lib/stores';
	import type { UtilityItem } from '$lib/interfaces';
	import { appDefaults } from '$lib/constants';

	export let utilityItems: UtilityItem[] = [];

	function handleUtilitySelect(utilityId: string) {
		utilityStore.toggle(utilityId);
	}
</script>

<div class="glass-card rounded-2xl p-6 smooth-transition hover:shadow-lg">
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center">
			<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
				<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
			</div>
			<div>
				<h3 class="text-xl font-semibold text-gray-900">Комунални услуги</h3>
				<p class="text-sm text-gray-600">Изберете услуги за включване</p>
			</div>
		</div>
		<div class="text-right">
			<div class="text-sm font-medium text-gray-900">{$selectedUtilityItems.length}/{utilityItems.length}</div>
			<div class="text-xs text-gray-500">Избрани</div>
		</div>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
		{#each utilityItems as utility (utility.id)}
			<button
				class="relative px-4 py-4 text-left rounded-xl border smooth-transition focus-enhanced group {$selectedUtilityItems.includes(
					utility.id
				)
					? 'bg-purple-50 border-purple-200 text-purple-900 shadow-sm ring-2 ring-purple-500 ring-opacity-20'
					: 'bg-white border-gray-200 text-gray-700 hover-slate hover:shadow-sm'}"
				on:click={() => handleUtilitySelect(utility.id)}
			>
				<div class="flex items-center justify-between">
					<div class="font-medium">{utility.name}</div>
					{#if $selectedUtilityItems.includes(utility.id)}
						<div class="flex items-center">
							<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

	<!-- Quick Actions -->
	<div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
		<button
			on:click={() => selectedUtilityItems.set(utilityItems.map((u) => u.id))}
			class="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
		>
			Избери всички
		</button>
		<button
			on:click={() => utilityStore.set(appDefaults.utilities)}
			class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
		>
			Възстанови по подразбиране
		</button>
	</div>
</div>
