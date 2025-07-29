<script lang="ts">
	// Multi-step form state
	export let currentStep: number;
	export let totalSteps: number;
	export let canProceedToNext: boolean;
	export let loading: boolean;
	export let canSubmit: boolean;

	function nextStep() {
		if (currentStep < totalSteps) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}
</script>

<!-- Navigation Buttons -->
<div class="flex justify-between pt-6">
	<button
		type="button"
		on:click={prevStep}
		class="inline-flex items-center px-6 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
		disabled={currentStep === 1}
	>
		<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
		</svg>
		Назад
	</button>

	{#if currentStep < totalSteps}
		<button
			type="button"
			on:click={nextStep}
			class="inline-flex items-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
			disabled={!canProceedToNext}
		>
			Напред
			<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
			</svg>
		</button>
	{:else}
		<button
			type="submit"
			class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
			disabled={loading || !canSubmit}
		>
			{#if loading}
				<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Изчислява анализа...
			{:else}
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					></path>
				</svg>
				Изчисли въздействието върху покупателната сила
			{/if}
		</button>
	{/if}
</div>
