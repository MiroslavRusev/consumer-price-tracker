<script lang="ts">
	import { onMount } from 'svelte';
	import Form from '../components/form/Form.svelte';
	import ChartSection from '../components/structural/chartSection.svelte';
	import ControlsSection from '../components/structural/controlSection.svelte';
	import { useDataManager } from '$lib/dataManagement/dataManager';
	import { appDefaults } from '$lib/constants';

	// Initialize data manager
	const dataManager = useDataManager();

	// Only shared state between components
	let selectedRange = appDefaults.range;

	onMount(async () => {
		await dataManager.initializeData();
	});
</script>

<main class="main-content flex-1 pb-8 min-h-screen">
	<!-- Modern Hero Section with Slate Color Scheme -->
	<div class="hero-slate relative overflow-hidden">
		<!-- Subtle Pattern Overlay -->
		<div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

		<!-- Hero Content -->
		<div class="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-6">
			<div class="text-center mb-8">
				<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">Анализатор на потребителските цени</h1>
				<p class="text-lg md:text-xl text-slate-200 mb-2 font-light">
					Проследете промените в цените на основните продукти и услуги, и тяхното влияние върху покупателната сила
				</p>
				<div class="flex items-center justify-center text-slate-300 text-sm">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						></path>
					</svg>
					Данни актуализирани: Май 2025
				</div>
			</div>

			<ControlsSection bind:selectedRange />
		</div>

		<div class="max-w-7xl mx-auto px-6 py-8">
			<ChartSection bind:selectedRange />
		</div>
	</div>

	<!-- Form Section with Better Integration -->
	<div class="max-w-6xl mx-auto px-6 py-8">
		<div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
			<Form />
		</div>
	</div>
</main>
