<script>
	let { children } = $props();
	import '../styles/input.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Footer from '../components/structural/Footer.svelte';
	import Header from '../components/structural/Header.svelte';
	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<Header />

{@render children()}

<Footer />
