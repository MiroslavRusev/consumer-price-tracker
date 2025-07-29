<script lang="ts">
	// @ts-nocheck
	import { Bar } from 'svelte5-chartjs';
	import type { FuelBarChartData } from '$lib/interfaces';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarElement,
		LinearScale,
		CategoryScale,
		BarController
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale, BarController);

	export let data: FuelBarChartData = {
		labels: [],
		datasets: []
	};

	// Define options outside component to avoid Svelte state cloning issues
	const chartOptions = {
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
				labels: {
					usePointStyle: true,
					padding: 20,
					font: {
						size: 12,
						weight: '500'
					}
				}
			},
			tooltip: {
				backgroundColor: 'rgba(255, 255, 255, 0.95)',
				titleColor: '#374151',
				bodyColor: '#374151',
				borderColor: '#E5E7EB',
				borderWidth: 1,
				cornerRadius: 8,
				displayColors: true,
				padding: 12,
				callbacks: {
					label: function (context) {
						return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} лв.`;
					}
				}
			}
		},
		scales: {
			x: {
				grid: {
					color: '#F3F4F6',
					drawBorder: false
				},
				ticks: {
					color: '#6B7280',
					font: {
						size: 11
					}
				}
			},
			y: {
				grid: {
					color: '#F3F4F6',
					drawBorder: false
				},
				ticks: {
					color: '#6B7280',
					font: {
						size: 11
					},
					callback: function (value) {
						return value + ' лв.';
					}
				}
			}
		}
	};
</script>

<div class="w-full max-w-md lg:max-w-lg h-full">
	<Bar {data} height={300} options={chartOptions} />
</div>
