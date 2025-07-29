<script>
	let { children } = $props();
	import '../styles/input.css';
	import Footer from '../components/structural/Footer.svelte';
	import Header from '../components/structural/Header.svelte';
</script>

<Header />

{@render children()}

<Footer />
