import { writable, readable } from 'svelte/store';
import { getFuelItems } from '$lib/dataFetcher/fuelDataFetcher';
import { getFoodItems } from '$lib/dataFetcher/foodDataFetcher';
import { utilityItems as utilityItemsConstants, appDefaults } from '$lib/constants';
import { foodStore, fuelStore, utilityStore } from '$lib/stores';
import type { FoodItem, FuelItem, UtilityItem, ChartData, FuelBarChartData } from '$lib/interfaces';

// Create singleton stores (only created once)
const loading = writable(true);
const error = writable(false);
const foodItems = writable<FoodItem[]>([]);
const fuelItems = writable<FuelItem[]>([]);
const utilityItems = writable<UtilityItem[]>(utilityItemsConstants);

// Chart data stores
const foodChartData = writable<ChartData>({ labels: [], datasets: [] });
const fuelChartData = writable<FuelBarChartData>({ labels: [], datasets: [] });
const utilityChartData = writable<ChartData>({ labels: [], datasets: [] });

// Initialize data function
async function initializeData() {
	try {
		loading.set(true);
		error.set(false);

		// Load food and fuel items from API
		const [fetchedFoodItems, fetchedFuelItems] = await Promise.all([getFoodItems(), getFuelItems()]);

		// Update stores with fetched data
		foodItems.set(fetchedFoodItems);
		fuelItems.set(fetchedFuelItems);

		// Set default selections
		if (fetchedFoodItems.length > 0 && !fetchedFoodItems.find((foodItem) => foodItem.id === 'bread')) {
			foodStore.set([fetchedFoodItems[0].id]);
		} else {
			foodStore.set(appDefaults.foods);
		}
		fuelStore.set(appDefaults.fuels[0]);
		utilityStore.set(appDefaults.utilities[0]);
	} catch (err) {
		console.error('Error loading data:', err);
		error.set(true);
	} finally {
		loading.set(false);
	}
}

// Export function that returns the same store instances every time
export function useDataManager() {
	return {
		loading: readable(false, (set) => loading.subscribe(set)),
		error: readable(false, (set) => error.subscribe(set)),
		foodItems: readable<FoodItem[]>([], (set) => foodItems.subscribe(set)),
		fuelItems: readable<FuelItem[]>([], (set) => fuelItems.subscribe(set)),
		utilityItems: readable<UtilityItem[]>(utilityItemsConstants, (set) => utilityItems.subscribe(set)),
		foodChartData: readable<ChartData>({ labels: [], datasets: [] }, (set) => foodChartData.subscribe(set)),
		fuelChartData: readable<FuelBarChartData>({ labels: [], datasets: [] }, (set) => fuelChartData.subscribe(set)),
		utilityChartData: readable<ChartData>({ labels: [], datasets: [] }, (set) => utilityChartData.subscribe(set)),
		// Expose writable versions for components that need to update chart data
		setFoodChartData: foodChartData.set,
		setFuelChartData: fuelChartData.set,
		setUtilityChartData: utilityChartData.set,
		initializeData
	};
}
