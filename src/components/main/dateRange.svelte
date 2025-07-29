<script lang="ts">
	import { timeRanges } from '$lib/constants';

	export let selectedRange: string;

	function handleRangeSelect(rangeId: string) {
		selectedRange = rangeId;
	}
</script>

<div class="glass-card rounded-2xl p-6 smooth-transition hover:shadow-lg">
	<div class="flex items-center mb-6">
		<div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
			<svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				></path>
			</svg>
		</div>
		<div>
			<h3 class="text-xl font-semibold text-gray-900">Времеви период</h3>
			<p class="text-sm text-gray-600">Изберете период за анализ</p>
		</div>
	</div>

	<div class="space-y-3">
		{#each timeRanges as range (range.id)}
			<button
				class="w-full relative px-4 py-4 text-left rounded-xl border smooth-transition focus-enhanced {selectedRange ===
				range.id
					? 'selected-slate ring-2 ring-slate-500 ring-opacity-20 shadow-sm'
					: 'bg-white border-gray-200 text-gray-700 hover-slate hover:shadow-sm'}"
				on:click={() => handleRangeSelect(range.id)}
			>
				<div class="flex items-center justify-between">
					<div class="font-medium">{range.label}</div>
					{#if selectedRange === range.id}
						<div class="flex items-center">
							<svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
								></path>
							</svg>
						</div>
					{:else}
						<div class="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
					{/if}
				</div>
			</button>
		{/each}
	</div>
</div>
