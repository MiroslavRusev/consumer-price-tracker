<script lang="ts">
	import MortgageSummary from './MortgageSummary.svelte';
	import MortgageSuggestion from './MortgageSuggestion.svelte';
	import type { EnrichedMortgageCalculationResult } from '$lib/interfaces';
	import { formatCurrency } from '$lib/utils/helperMethods';

	let {
		result,
		error,
		currency
	}: { result: EnrichedMortgageCalculationResult | null; error: string | null; currency: string } = $props();
</script>

{#if error}
	<div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
		<div class="flex items-center">
			<svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div>
				<h3 class="text-lg font-semibold text-red-900">Грешка при изчислението</h3>
				<p class="text-red-700 mt-1">{error}</p>
			</div>
		</div>
	</div>
{/if}

{#if result}
	<div class="space-y-6 mt-6">
		<!-- Summary Card -->
		<MortgageSummary {result} {currency} />

		{#if result.paymentType === 'annuity'}
			<!-- Annuity Payments Results -->
			<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
				<h3 class="text-xl font-bold text-gray-900 mb-4">Анюитетни вноски</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-blue-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Месечна вноска</div>
						<div class="text-2xl font-bold text-blue-600">
							{formatCurrency(result.monthlyPayment ?? 0, currency)}
						</div>
					</div>
					<div class="bg-blue-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Процент на месечната вноска от дохода</div>
						{#if result.paymentPercentageWarning}
							<div class="text-2xl font-bold text-red-600">
								{(result.paymentPercentageFromIncome ?? 0).toFixed(2)}%
							</div>
						{:else}
							<div class="text-2xl font-bold text-green-600">
								{(result.paymentPercentageFromIncome ?? 0).toFixed(2)}%
							</div>
						{/if}
					</div>
					<div class="bg-red-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Общ лихвен разход</div>
						<div class="text-2xl font-bold text-orange-600">
							{formatCurrency(result.totalInterest ?? 0, currency)}
						</div>
					</div>
					<div class="bg-gray-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Обща сума за връщане</div>
						<div class="text-2xl font-bold text-gray-900">
							{formatCurrency(result.totalAmount ?? 0, currency)}
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Declining Payments Results -->
			<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
				<h3 class="text-xl font-bold text-gray-900 mb-4">Намаляващи вноски</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div class="bg-orange-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Първа вноска</div>
						<div class="text-xl font-bold text-orange-600">
							{formatCurrency(result.firstPayment ?? 0, currency)}
						</div>
						<div class="text-xs text-gray-500">най-висока</div>
					</div>
					<div class="bg-yellow-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Средна вноска</div>
						<div class="text-xl font-bold text-yellow-600">
							{formatCurrency(result.middlePayment ?? 0, currency)}
						</div>
						<div class="text-xs text-gray-500">в средата на периода</div>
					</div>
					<div class="bg-green-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Последна вноска</div>
						<div class="text-xl font-bold text-green-600">
							{formatCurrency(result.lastPayment ?? 0, currency)}
						</div>
						<div class="text-xs text-gray-500">най-ниска</div>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-blue-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Процент на средната месечна вноска от дохода</div>
						{#if result.paymentPercentageWarning}
							<div class="text-2xl font-bold text-red-600">
								{(result.paymentPercentageFromIncome ?? 0).toFixed(2)}%
							</div>
						{:else}
							<div class="text-2xl font-bold text-green-600">
								{(result.paymentPercentageFromIncome ?? 0).toFixed(2)}%
							</div>
						{/if}
					</div>
					<div class="bg-red-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Общ лихвен разход</div>
						<div class="text-2xl font-bold text-red-600">
							{formatCurrency(result.totalInterestDecline ?? 0, currency)}
						</div>
					</div>
					<div class="bg-gray-50 rounded-lg p-4 text-center">
						<div class="text-sm text-gray-600 mb-1">Обща сума за връщане</div>
						<div class="text-2xl font-bold text-gray-900">
							{formatCurrency(result.totalAmountDecline ?? 0, currency)}
						</div>
					</div>
				</div>
			</div>
		{/if}
		<!-- Suggestions -->
		<MortgageSuggestion {result} {currency} />

		{#if result.extraPaymentPerYear > 0}
			<!-- Extra Payments Results -->
			<div class="bg-green-50 border border-green-200 rounded-xl p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-4">
					Резултат с допълнителна вноска от {formatCurrency(result.extraPaymentPerYear, currency)} годишно
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="bg-white rounded-lg p-4 text-center border border-green-200">
						<div class="text-sm text-gray-600 mb-1">Общ лихвен разход</div>
						<div class="text-xl font-bold text-green-600">
							{formatCurrency(result.totalInterestWithExtra ?? 0, currency)}
						</div>
						<div class="text-xs text-green-700 mt-1">
							Икономия: {formatCurrency(
								(result.paymentType === 'annuity'
									? (result.totalInterest ?? 0)
									: (result.totalInterestDecline ?? 0)) - (result.totalInterestWithExtra ?? 0),
								currency
							)}
						</div>
					</div>
					<div class="bg-white rounded-lg p-4 text-center border border-green-200">
						<div class="text-sm text-gray-600 mb-1">Обща сума за връщане</div>
						<div class="text-xl font-bold text-gray-900">
							{formatCurrency(result.totalAmountWithExtra ?? 0, currency)}
						</div>
					</div>
					<div class="bg-white rounded-lg p-4 text-center border border-green-200">
						<div class="text-sm text-gray-600 mb-1">Спестени месеци</div>
						<div class="text-xl font-bold text-blue-600">{result.monthsSavedWithExtra ?? 0}</div>
						<div class="text-xs text-blue-700 mt-1">
							{Math.floor((result.monthsSavedWithExtra ?? 0) / 12)} г. и {(result.monthsSavedWithExtra ??
								0) % 12} м.
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
