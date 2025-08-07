<script lang="ts">
	import type { FormCalculationResult } from '$lib/interfaces';
	import { svgExporter } from '$lib/assets/svgExporter';

	export let error: string | null;
	export let result: FormCalculationResult | null;
</script>

<!-- Results and Error Display -->
{#if error}
	<div class="bg-red-50 border border-red-200 rounded-2xl p-6 mt-8">
		<div class="flex items-start">
			<div class="flex-shrink-0">
				{@html svgExporter.redCheck}
			</div>
			<div class="ml-3">
				<h3 class="text-lg font-medium text-red-800">Грешка при анализа</h3>
				<div class="mt-2 text-red-700">{error}</div>
			</div>
		</div>
	</div>
{/if}

{#if result}
	<div class="bg-gradient-to-br from-green-50 to-slate-50 border border-green-200 rounded-2xl p-8 mt-8">
		<div class="flex items-start mb-6">
			<div class="flex-shrink-0">
				<div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
					{@html svgExporter.analysisIcon}
				</div>
			</div>
			<div class="ml-4">
				<h3 class="text-2xl font-bold text-gray-900 mb-2">Резултати от анализа на покупателната сила</h3>
				<p class="text-gray-600">Въз основа на вашите избрани продукти и времеви период</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<div class="text-sm font-medium text-gray-600 mb-1">Текущ месечен доход</div>
				<div class="text-2xl font-bold text-green-600">{result.monthlyBudget.toFixed(2)} лв.</div>
			</div>
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<div class="text-sm font-medium text-gray-600 mb-1">Исторически месечен доход</div>
				<div class="text-2xl font-bold text-slate-600">{result.monthlyBudgetThen.toFixed(2)} лв.</div>
			</div>
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<div class="text-sm font-medium text-gray-600 mb-1">Процент инфлация</div>
				<div class="text-2xl font-bold text-orange-600">{result.inflationRate.toFixed(2)}%</div>
			</div>
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<div class="text-sm font-medium text-gray-600 mb-1">Текущи разходи</div>
				<div class="text-2xl font-bold text-red-600">{result.totalExpensesNow.toFixed(2)} лв.</div>
			</div>
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<div class="text-sm font-medium text-gray-600 mb-1">Исторически разходи</div>
				<div class="text-2xl font-bold text-red-500">{result.totalExpensesThen.toFixed(2)} лв.</div>
			</div>
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<div class="text-sm font-medium text-gray-600 mb-1">Нетна разлика в разходите</div>
				<p class="text-sm text-gray-600 mb-1">преизчислена към настояща дата</p>
				<div class="text-2xl font-bold {result.netExpensesDifference > 0 ? 'text-red-600' : 'text-green-600'}">
					{result.netExpensesDifference > 0 ? '+' : ''}{result.netExpensesDifference.toFixed(2)} лв.
				</div>
			</div>
		</div>

		<!-- Purchasing Power Comparison -->
		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<h4 class="text-lg font-semibold text-gray-900 mb-4">Анализ на покупателната сила</h4>
			<div class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<div class="text-sm font-medium text-gray-600 mb-1">Текущ разполагаем доход</div>
						<div class="text-xl font-bold text-slate-600">
							{result.currentDisposableIncome.toFixed(2)} лв.
						</div>
					</div>
					<div>
						<div class="text-sm font-medium text-gray-600 mb-1">Исторически разполагаем доход</div>
						<div class="text-xl font-bold text-slate-500">
							{result.previousDisposableIncome.toFixed(2)} лв.
						</div>
					</div>
				</div>

				<div class="border-t border-gray-200 pt-4">
					<div class="text-sm font-medium text-gray-600 mb-2">
						Еквивалентен исторически доход (със същата покупателна сила като днешния)
					</div>
					<div class="text-lg font-semibold text-gray-900 mb-3">
						{result.previousSalaryValueMatchingCurrentPurchasingPower.toFixed(2)} лв.
					</div>

					{#if result.previousSalaryValueMatchingCurrentPurchasingPower > result.monthlyBudgetThen}
						<div class="bg-green-100 border border-green-300 rounded-lg p-4">
							<div class="flex items-center">
								{@html svgExporter.greenCheck}
								<div class="text-green-800 font-semibold">
									Вашата покупателна сила се е УВЕЛИЧИЛА с {(
										result.previousSalaryValueMatchingCurrentPurchasingPower - result.monthlyBudgetThen
									).toFixed(2)} лв.
								</div>
							</div>
						</div>
					{:else}
						<div class="bg-red-100 border border-red-300 rounded-lg p-4">
							<div class="flex items-center">
								{@html svgExporter.redCheck}
								<div class="text-red-800 font-semibold">
									Вашата покупателна сила се е НАМАЛИЛА с {(
										result.monthlyBudgetThen - result.previousSalaryValueMatchingCurrentPurchasingPower
									).toFixed(2)} лв.
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
