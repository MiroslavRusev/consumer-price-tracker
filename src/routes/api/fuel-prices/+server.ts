import { json } from '@sveltejs/kit';
import { FUELO_API_URL, FUELO_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const fuelType = url.searchParams.get('fuelType');
	const date = url.searchParams.get('date');

	// Use the parameters from the request or fall back to environment variables
	const apiUrl = `${FUELO_API_URL}/price?key=${FUELO_API_KEY}&fuel=${fuelType}&date=${date}`;

	const response = await fetch(apiUrl);
	const data = await response.json();
	const dateFromRequest = new Date(date || '');
	// Handle EUR adoption in Bulgaria
	if (dateFromRequest && dateFromRequest < new Date('2026-01-01')) {
		data.price /= 1.95583;
	}
	return json(data);
};
