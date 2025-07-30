<script>
	import { svgExporter } from '$lib/assets/svgExporter';
	export let currentStep;
	export let isStep1Valid;
	export let isStep2Valid;
</script>

<div class="flex items-center justify-center space-x-4">
	<!-- Step 1 -->
	<div class="flex items-center">
		<div
			class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 {currentStep ===
			1
				? 'bg-slate-600 text-white ring-4 ring-slate-600 ring-opacity-20'
				: currentStep > 1 || isStep1Valid
					? 'bg-green-500 text-white'
					: 'bg-gray-200 text-gray-600'}"
		>
			{#if currentStep > 1 || isStep1Valid}
				{@html svgExporter.stepOne}
			{:else}
				1
			{/if}
		</div>

		<!-- Connector Line -->
		<div
			class="w-16 h-1 mx-2 rounded-full {currentStep > 1 || (isStep1Valid && isStep2Valid)
				? 'bg-green-500'
				: 'bg-gray-200'}"
		></div>
	</div>

	<!-- Step 2 -->
	<div class="flex items-center">
		<div
			class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 {currentStep ===
			2
				? 'bg-slate-600 text-white ring-4 ring-slate-600 ring-opacity-20'
				: isStep2Valid
					? 'bg-green-500 text-white'
					: 'bg-gray-200 text-gray-600'}"
		>
			{#if isStep2Valid}
				{@html svgExporter.stepTwo}
			{:else}
				2
			{/if}
		</div>
	</div>
</div>
