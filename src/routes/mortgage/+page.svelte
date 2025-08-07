<script lang="ts">
	import MortgageForm from '$lib/../components/mortgage/MortgageForm.svelte';
	import MortgageResults from '$lib/../components/mortgage/MortgageResults.svelte';
	import { mortgageFormDefaults } from '$lib/constants';
	import type { EnrichedMortgageCalculationResult } from '$lib/interfaces';

	let error: string | null;
	let result: EnrichedMortgageCalculationResult | null;
	let currency: string = mortgageFormDefaults.currency;
</script>

<svelte:head>
	<title>Ипотечен калкулатор | Svetle</title>
	<meta
		name="description"
		content="Изчислете вашите ипотечни вноски с нашия подробен калкулатор. Анюитетни и намаляващи плащания, допълнителни вноски и повече."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">Един по-различен ипотечен калкулатор</h1>
			<p class="mt-4 text-xl text-gray-600">Изчислете оптималният ипотечен кредит спрямо вашия доход</p>
		</div>

		<!-- Mortgage Form -->
		<MortgageForm bind:error bind:result bind:currency />

		<!-- Results -->
		<MortgageResults {result} {error} {currency} />
	</div>
</div>
