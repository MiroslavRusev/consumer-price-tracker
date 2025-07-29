<script lang="ts">
	import { selectedUtilityItems, utilityStore } from '$lib/stores';
	import type { UtilityItem } from '$lib/interfaces';

	export let utilityItems: UtilityItem[] = [];

	function handleUtilitySelect(utilityId: string) {
		utilityStore.toggle(utilityId);
	}
</script>

<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
	<h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">Битови услуги</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
		{#each utilityItems as utility (utility.id)}
			<button
				class="relative px-4 py-4 text-center rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 {$selectedUtilityItems.includes(
					utility.id
				)
					? 'bg-green-50 border-green-200 text-green-900 shadow-sm'
					: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}"
				on:click={() => handleUtilitySelect(utility.id)}
			>
				<div class="font-medium text-sm">{utility.name}</div>
				{#if $selectedUtilityItems.includes(utility.id)}
					<div class="absolute top-2 right-2 w-2 h-2 bg-green-600 rounded-full"></div>
				{/if}
			</button>
		{/each}
	</div>
</div>
