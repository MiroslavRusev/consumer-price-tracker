// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Environment variable types
declare module '$env/static/private' {
	export const EUROSTAT_API: string;
	export const FUELO_API_URL: string;
	export const FUELO_API_KEY: string;
	export const MAX_VALUE: number;
	export const MIN_POSITIVE_VALUE: number;
}

export {};
