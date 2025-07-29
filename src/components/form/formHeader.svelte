<script lang="ts">
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
		<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
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
