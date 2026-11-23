<script>
	let { children } = $props();
	import '../styles/input.css';
	import { browser, dev } from '$app/env';
	import { page } from '$app/state';
	import { inject, pageview } from '@vercel/analytics';
	import Footer from '../components/structural/Footer.svelte';
	import Header from '../components/structural/Header.svelte';

	// `@vercel/analytics/sveltekit` still imports `$app/stores`, which SvelteKit 3 removed,
	// so this does the same thing with the core API and `$app/state`.
	if (browser) {
		inject({ mode: dev ? 'development' : 'production', disableAutoTrack: true, framework: 'sveltekit' });
	}

	$effect(() => {
		if (page.route.id) {
			pageview({ route: page.route.id, path: page.url.pathname });
		}
	});
</script>

<Header />

{@render children()}

<Footer />
