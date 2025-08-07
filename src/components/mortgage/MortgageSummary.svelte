<script lang="ts">
	import { formatCurrency, formatNumber } from '$lib/utils/helperMethods';
	import type { EnrichedMortgageCalculationResult } from '$lib/interfaces';

	let { result, currency }: { result: EnrichedMortgageCalculationResult; currency: string } = $props();
</script>

<div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
	<h3 class="text-xl font-bold text-gray-900 mb-4">Обобщение</h3>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
		<div>
			<div class="text-gray-600">Лихвен процент</div>
			<div class="font-semibold text-gray-900">{formatNumber(result.interestRate)}%</div>
		</div>
		<div>
			<div class="text-gray-600">Срок</div>
			<div class="font-semibold text-gray-900">{result.loanTermMonths} месеца</div>
		</div>
		<div>
			<div class="text-gray-600">Тип плащания</div>
			<div class="font-semibold text-gray-900">
				{result.paymentType === 'annuity' ? 'Анюитетни' : 'Намаляващи'}
			</div>
		</div>
		<div>
			<div class="text-gray-600">Доп. вноска/год.</div>
			<div class="font-semibold text-gray-900">{formatCurrency(result.extraPaymentPerYear, currency)}</div>
		</div>
	</div>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
		<div>
			<div class="text-sm text-gray-600">Месечен доход</div>
			<div class="font-semibold text-gray-900">{formatCurrency(result.monthlyBudget, currency)}</div>
		</div>
		<div>
			<div class="text-sm text-gray-600">Стойност на имота</div>
			<div class="font-semibold text-gray-900">{formatCurrency(result.propertyPrice, currency)}</div>
		</div>
		<div>
			<div class="text-sm text-gray-600">Първоначална вноска</div>
			<div class="font-semibold text-green-600">{formatCurrency(result.downPayment, currency)}</div>
		</div>
		<div>
			<div class="text-sm text-gray-600">Сума за кредитиране</div>
			<div class="font-semibold text-blue-600">{formatCurrency(result.principalAmount, currency)}</div>
		</div>
	</div>
</div>
