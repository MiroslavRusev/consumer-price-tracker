import { writable } from 'svelte/store';
import type { FuelData } from './interfaces';

// Store for selected food IDs
export const selectedFoods = writable<string[]>([]);

// Store for selected utility IDs
export const selectedUtilityItems = writable<string[]>([]);

// Store for selected fuel ID (single selection)
export const selectedFuel = writable<string>('');

// Store for current fuel price
export const currentFuelPrice = writable<FuelData>({
	fuel: '',
	price: 0,
	dimension: '',
	date: ''
});

export const historicalFuelPrice = writable<FuelData>({
	fuel: '',
	price: 0,
	dimension: '',
	date: ''
});

// Helper functions to work with the store
export const foodStore = {
	// Toggle a food selection - prevents deselecting the last item
	toggle: (foodId: string) => {
		selectedFoods.update((foods) => {
			if (foods.includes(foodId)) {
				// Prevent deselecting if it's the only selected item
				if (foods.length === 1) {
					return foods;
				}
				return foods.filter((id) => id !== foodId);
			} else {
				return [...foods, foodId];
			}
		});
	},

	// Clear all selections
	clear: () => {
		selectedFoods.set([]);
	},

	// Set specific selections
	set: (foodIds: string[]) => {
		selectedFoods.set(foodIds);
	}
};

// Helper functions to work with the fuel store
export const fuelStore = {
	// Toggle a fuel selection - prevents deselecting if it's the only selected item
	toggle: (fuelId: string) => {
		selectedFuel.update((fuel) => {
			// If clicking on the currently selected fuel, don't deselect it (keep it selected)
			if (fuel === fuelId) {
				return fuel; // Keep the current selection
			} else {
				return fuelId; // Select the new fuel
			}
		});
	},

	// Clear selection
	clear: () => {
		selectedFuel.set('');
	},

	// Set specific selection
	set: (fuelId: string) => {
		selectedFuel.set(fuelId);
	}
};

// Helper functions to work with the utility store
export const utilityStore = {
	// Toggle a utility selection - prevents deselecting the last item
	toggle: (utilityId: string) => {
		selectedUtilityItems.update((utilities) => {
			if (utilities.includes(utilityId)) {
				// Prevent deselecting if it's the only selected item
				if (utilities.length === 1) {
					return utilities;
				}
				return utilities.filter((id) => id !== utilityId);
			} else {
				return [...utilities, utilityId];
			}
		});
	},
	// Clear selection
	clear: () => {
		selectedUtilityItems.set([]);
	},

	// Set specific selection
	set: (utilityIds: string[]) => {
		selectedUtilityItems.set(utilityIds);
	}
};
