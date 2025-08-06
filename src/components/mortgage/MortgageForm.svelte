<script lang="ts">
	import { mortgageFormDefaults } from '$lib/constants';
	import type { EnrichedMortgageCalculationResult } from '$lib/interfaces';
	let { monthlyBudget, loanAmount, downPayment, interestRate, loanTermYears, extraPaymentPerYear, paymentType } =
		mortgageFormDefaults;

	// Form fields

	export let loading: boolean = false;
	export let error: string | null = null;
	export let result: EnrichedMortgageCalculationResult | null = null;

	// Reactive calculations
	$: loanTermMonths = loanTermYears * 12;
	$: principalAmount = loanAmount - downPayment;

	// Form validation
	$: isValid =
		monthlyBudget > 0 &&
		loanAmount > 0 &&
		downPayment >= 0 &&
		downPayment < loanAmount &&
		interestRate >= 0 &&
		interestRate <= 50 &&
		loanTermYears > 0 &&
		loanTermYears <= 50 &&
		extraPaymentPerYear >= 0;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (loading) return;

		loading = true;
		error = null;
		result = null;

		const form = event.target as HTMLFormElement;
		const formDataObj = new FormData(form);

		try {
			const response = await fetch('/api/mortgage-calculate', {
				method: 'POST',
				body: formDataObj
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error);
			}

			result = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Грешка в изчисленията на ипотечния калкулатор';
		} finally {
			loading = false;
		}
	}
</script>

<div class="bg-white rounded-xl shadow-lg p-6 space-y-6">
	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Monthly Budget-->
		<div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
			<label class="block">
				<div class="flex items-center mb-3">
					<svg class="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
						></path>
					</svg>
					<span class="text-lg font-semibold text-gray-900">Месечен доход</span>
				</div>
				<input
					type="number"
					name="monthlyBudget"
					bind:value={monthlyBudget}
					disabled={loading}
					min="1000"
					step="50"
					class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
					placeholder="Въведете доходът си в началото на периода"
				/>
			</label>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Loan Amount -->
			<div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
				<label class="block">
					<div class="flex items-center mb-3">
						<svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
							></path>
						</svg>
						<span class="text-lg font-semibold text-blue-900">Стойност на имота</span>
					</div>
					<input
						type="number"
						name="loanAmount"
						bind:value={loanAmount}
						disabled={loading}
						min="1000"
						step="1000"
						class="w-full px-4 py-3 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
						placeholder="Въведете стойността на имота в лева"
					/>
				</label>
			</div>

			<!-- Down Payment -->
			<div class="bg-green-50 border border-green-200 rounded-xl p-6">
				<label class="block">
					<div class="flex items-center mb-3">
						<svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span class="text-lg font-semibold text-green-900">Първоначална вноска</span>
					</div>
					<input
						type="number"
						name="downPayment"
						bind:value={downPayment}
						disabled={loading}
						min="0"
						step="1000"
						class="w-full px-4 py-3 bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
						placeholder="Въведете първоначалната вноска в лева"
					/>
					<div class="text-sm text-green-700 mt-2">
						Сума за кредитиране: {principalAmount.toLocaleString('bg-BG')} лв.
					</div>
				</label>
			</div>
		</div>

		<!-- Interest Rate and Term -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Interest Rate -->
			<div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
				<label class="block">
					<div class="flex items-center mb-3">
						<svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							></path>
						</svg>
						<span class="text-lg font-semibold text-purple-900">Лихвен процент</span>
					</div>
					<input
						type="number"
						name="interestRate"
						bind:value={interestRate}
						disabled={loading}
						min="0"
						max="50"
						step="0.01"
						class="w-full px-4 py-3 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
						placeholder="2.55"
					/>
					<div class="text-sm text-purple-700 mt-2">% годишен лихвен процент</div>
				</label>
			</div>

			<!-- Loan Term -->
			<div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
				<label class="block">
					<div class="flex items-center mb-3">
						<svg class="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							></path>
						</svg>
						<span class="text-lg font-semibold text-orange-900">Срок на кредита</span>
					</div>
					<input
						type="number"
						bind:value={loanTermYears}
						disabled={loading}
						min="1"
						max="50"
						step="1"
						class="w-full px-4 py-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
						placeholder="25"
					/>
					<!-- Hidden input for API - months -->
					<input type="hidden" name="loanTermMonths" value={loanTermMonths} />
					<div class="text-sm text-orange-700 mt-2">
						{loanTermYears} години ({loanTermMonths} месеца)
					</div>
				</label>
			</div>
		</div>

		<!-- Extra Payment -->
		<div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
			<label class="block">
				<div class="flex items-center mb-3">
					<svg class="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						></path>
					</svg>
					<span class="text-lg font-semibold text-yellow-900">Допълнителна годишна вноска</span>
				</div>
				<input
					type="number"
					name="extraPaymentPerYear"
					bind:value={extraPaymentPerYear}
					disabled={loading}
					min="0"
					step="100"
					class="w-full px-4 py-3 bg-white border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
					placeholder="0"
				/>
				<div class="text-sm text-yellow-700 mt-2">Допълнителна сума за намаляване на главницата (по избор)</div>
			</label>
		</div>

		<!-- Payment Type -->
		<div class="bg-slate-50 border border-slate-200 rounded-xl p-6">
			<div class="flex items-center mb-4">
				<svg class="w-6 h-6 text-slate-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
					></path>
				</svg>
				<span class="text-lg font-semibold text-slate-900">Тип на плащанията</span>
			</div>

			<div class="space-y-4">
				<label class="flex items-center space-x-3 cursor-pointer">
					<input
						type="radio"
						name="paymentType"
						value="annuity"
						bind:group={paymentType}
						disabled={loading}
						class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
					/>
					<div>
						<div class="font-medium text-gray-900">Анюитетни вноски</div>
						<div class="text-sm text-gray-600">Еднакви месечни вноски през целия срок на кредита</div>
					</div>
				</label>

				<label class="flex items-center space-x-3 cursor-pointer">
					<input
						type="radio"
						name="paymentType"
						value="declining"
						bind:group={paymentType}
						disabled={loading}
						class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
					/>
					<div>
						<div class="font-medium text-gray-900">Намаляващи вноски</div>
						<div class="text-sm text-gray-600">
							Намаляващи месечни вноски - първоначално по-високи, после по-ниски
						</div>
					</div>
				</label>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="text-center">
			<button
				type="submit"
				disabled={!isValid || loading}
				class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
			>
				{#if loading}
					<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Изчислява...
				{:else}
					Изчисли ипотека
				{/if}
			</button>
		</div>
	</form>
</div>
