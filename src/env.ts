import { defineEnvVars } from '@sveltejs/kit/env';

// See https://svelte.dev/docs/kit/environment-variables
// Server-only, inlined at build time (same behaviour as the old `$env/static/private`).
export const variables = defineEnvVars({
	EUROSTAT_API: {
		static: true,
		description: 'Base URL for the Eurostat dissemination API'
	},
	FUELO_API_URL: {
		static: true,
		description: 'Fuelo price API endpoint'
	},
	FUELO_API_KEY: {
		static: true,
		description: 'Fuelo API key'
	}
});
