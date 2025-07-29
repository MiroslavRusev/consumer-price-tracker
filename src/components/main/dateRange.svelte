<script lang="ts">
	import { timeRanges } from '$lib/constants';

	export let selectedRange: string;

	function handleRangeSelect(rangeId: string) {
		selectedRange = rangeId;
	}
</script>

<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
	<h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">Филтрирай по период</h2>
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		{#each timeRanges as range (range.id)}
			<button
				class="relative px-6 py-4 text-left rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {selectedRange ===
				range.id
					? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'
					: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}"
				on:click={() => handleRangeSelect(range.id)}
			>
				<div class="font-medium">{range.label}</div>
				{#if selectedRange === range.id}
					<div class="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full"></div>
				{/if}
			</button>
		{/each}
	</div>
</div>
