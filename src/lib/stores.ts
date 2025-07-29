import { writable } from 'svelte/store';
import type { FuelData } from './interfaces';

// Store for selected food IDs
export const selectedFoods = writable<string[]>([]);

// Store for selected utility IDs
export const selectedUtilityItems = writable<string[]>([]);

// Store for selected fuel ID (single selection)
export const selectedFuels = writable<string>('');

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
	// Add a food to selection
	add: (foodId: string) => {
		selectedFoods.update((foods) => {
			if (!foods.includes(foodId)) {
				return [...foods, foodId];
			}
			return foods;
		});
	},

	// Remove a food from selection
	remove: (foodId: string) => {
		selectedFoods.update((foods) => foods.filter((id) => id !== foodId));
	},

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
	// Add a fuel to selection (replaces current selection)
	add: (fuelId: string) => {
		selectedFuels.set(fuelId);
	},

	// Remove a fuel from selection (if it matches the current selection)
	remove: (fuelId: string) => {
		selectedFuels.update((fuel) => (fuel === fuelId ? '' : fuel));
	},

	// Toggle a fuel selection - prevents deselecting if it's the only selected item
	toggle: (fuelId: string) => {
		selectedFuels.update((fuel) => {
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
		selectedFuels.set('');
	},

	// Set specific selection
	set: (fuelId: string) => {
		selectedFuels.set(fuelId);
	}
};

// Helper functions to work with the utility store
export const utilityStore = {
	// Add a utility to selection
	add: (utilityId: string) => {
		selectedUtilityItems.update((utilities) => {
			if (!utilities.includes(utilityId)) {
				return [...utilities, utilityId];
			}
			return utilities;
		});
	},

	// Remove a utility from selection
	remove: (utilityId: string) => {
		selectedUtilityItems.update((utilities) => utilities.filter((id) => id !== utilityId));
	},

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
	set: (utilityId: string) => {
		selectedUtilityItems.set([utilityId]);
	}
};
