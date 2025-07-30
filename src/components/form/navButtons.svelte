<script lang="ts">
	import { svgExporter } from '$lib/assets/svgExporter';
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
		{@html svgExporter.backArrow}
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
			{@html svgExporter.forwardArrow}
		</button>
	{:else}
		<button
			type="submit"
			class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
			disabled={loading || !canSubmit}
		>
			{#if loading}
				{@html svgExporter.loading}
				Изчислява анализа...
			{:else}
				{@html svgExporter.calculate}
				Изчисли
			{/if}
		</button>
	{/if}
</div>
