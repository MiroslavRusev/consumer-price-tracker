<script lang="ts">
	import { formatCurrency } from '$lib/utils/helperMethods';
	import type { EnrichedMortgageCalculationResult } from '$lib/interfaces';
	let { result, currency }: { result: EnrichedMortgageCalculationResult; currency: string } = $props();
</script>

{#if result.paymentPercentageWarning}
	<div class="bg-red-50 border border-red-200 rounded-xl p-6">
		<h3 class="text-xl font-bold text-gray-900">Препоръчителни максимални стойности на кредитиране</h3>
		<p class="text-gray-600 mt-2">
			Стойността на месечната ви вноска надвишава препоръчаните 28% от дохода. С вашият доход може да се възползвате от кредит със следните
			параметри:
		</p>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="bg-red-50 rounded-lg pt-4">
				<div class="text-sm text-gray-600 mb-1">Максимална стойност на имота</div>
				<div class="text-2xl font-bold text-red-600">
					{formatCurrency(result.maximumRecommendedLoanAmount ?? 0, currency)}
				</div>
			</div>
			<div class="bg-red-50 rounded-lg pt-4">
				<div class="text-sm text-gray-600 mb-1">Максимална месечна вноска</div>
				<div class="text-2xl font-bold text-red-600">
					{formatCurrency(result.maximumRecommendedMonthlyPayment ?? 0, currency)}
				</div>
			</div>
			<div class="bg-red-50 rounded-lg pt-4">
				<div class="text-sm text-gray-600 mb-1">Максимално кредитиране</div>
				<div class="text-2xl font-bold text-red-600">
					{formatCurrency(result.maximumRecommendedPrincipal ?? 0, currency)}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-green-50 border border-green-200 rounded-xl p-6">
		<h3 class="text-xl font-bold text-gray-900">Препоръчителни максимални стойности на кредитиране</h3>
		<p class="text-gray-600 mt-2">
			Стойността на месечната ви вноска е по-малко от 28% от дохода. С вашият доход може да се възползвате от кредит със следните параметри:
		</p>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="bg-green-50 rounded-lg pt-4">
				<div class="text-sm text-gray-600 mb-1">Максимална стойност на имота</div>
				<div class="text-2xl font-bold text-green-600">
					{formatCurrency(result.maximumRecommendedLoanAmount ?? 0, currency)}
				</div>
			</div>
			<div class="bg-green-50 rounded-lg pt-4">
				<div class="text-sm text-gray-600 mb-1">Максимална месечна вноска</div>
				<div class="text-2xl font-bold text-green-600">
					{formatCurrency(result.maximumRecommendedMonthlyPayment ?? 0, currency)}
				</div>
			</div>
			<div class="bg-green-50 rounded-lg pt-4">
				<div class="text-sm text-gray-600 mb-1">Максимално кредитиране</div>
				<div class="text-2xl font-bold text-green-600">
					{formatCurrency(result.maximumRecommendedPrincipal ?? 0, currency)}
				</div>
			</div>
		</div>
	</div>
{/if}
