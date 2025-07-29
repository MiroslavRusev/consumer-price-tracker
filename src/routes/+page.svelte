<script lang="ts">
	import { onMount } from 'svelte';
	import Form from '../components/main/Form.svelte';
	import ChartSection from '../components/structural/chartSection.svelte';
	import ControlsSection from '../components/structural/controlSection.svelte';
	import HeaderImage from '$lib/assets/header-image.webp';
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
	<!-- Hero Section with Background Image -->
	<div
		class="overlay-image relative"
		style="background-image: url({HeaderImage}); background-size: cover; background-position: center;"
	>
		<div class="max-w-7xl mx-auto chart-container">
			<ChartSection bind:selectedRange />
		</div>

		<ControlsSection bind:selectedRange />
	</div>
	<div class="max-w-4xl mx-auto px-6">
		<Form />
	</div>
</main>
