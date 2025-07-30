<script lang="ts">
	import { svgExporter } from '$lib/assets/svgExporter';
	export let periodString: string;
	export let productsString: string;
	export let selectedFuelString: string | undefined;
	export let selectedUtilityItemsString: string;
</script>

<div class="text-center mb-6">
	<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Анализ на покупателната сила</h2>
	<p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
		Изчислете как инфлацията е повлияла на вашата покупателна сила въз основа на избраните продукти и времеви период
	</p>
</div>

<!-- Selected Configuration Summary -->
<div class="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-5 mb-6">
	<h3 class="text-lg font-semibold text-slate-900 mb-3 flex items-center">
		{@html svgExporter.greenCheck}
		Конфигурация на анализа
	</h3>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
		<div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
			<div class="font-medium text-slate-900">Период</div>
			<div class="text-slate-700">{periodString}</div>
		</div>
		<div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
			<div class="font-medium text-slate-900">Продукти</div>
			<div class="text-slate-700 text-xs">{productsString}</div>
		</div>
		<div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
			<div class="font-medium text-slate-900">Гориво</div>
			<div class="text-slate-700">{selectedFuelString}</div>
		</div>
		<div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
			<div class="font-medium text-slate-900">Услуги</div>
			<div class="text-slate-700 text-xs">{selectedUtilityItemsString}</div>
		</div>
	</div>
</div>
