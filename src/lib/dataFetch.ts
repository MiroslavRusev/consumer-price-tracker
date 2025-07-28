import type { FoodApiResponse, FuelApiResponse, UtilityApiResponse } from './interfaces';

// Cache for API data - separate cache per URL
const cache = new Map<string, { data: FoodApiResponse | FuelApiResponse | UtilityApiResponse; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

// Fetch data from API
export const fetchApiData = async ({
	url
}: {
	url: string;
}): Promise<FoodApiResponse | FuelApiResponse | UtilityApiResponse> => {
	const now = Date.now();
	const cached = cache.get(url);

	// Return cached data if it's still valid
	if (cached && now - cached.timestamp < CACHE_DURATION) {
		return cached.data;
	}

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		cache.set(url, { data, timestamp: now });
		return data;
	} catch (error) {
		console.error('Error fetching API data:', error);
		// Return empty data structure if API fails
		// You might want to determine which type to return based on the URL or other context
		if (url.includes('food-prices')) {
			return {
				foodItems: [],
				labels: [],
				priceData: {}
			} as FoodApiResponse;
		} else if (url.includes('utility-prices')) {
			return {
				utilityItems: [],
				labels: [],
				priceData: {}
			} as UtilityApiResponse;
		} else {
			return {
				fuelData: []
			} as FuelApiResponse;
		}
	}
};
