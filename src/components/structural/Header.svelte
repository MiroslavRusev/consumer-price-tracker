<script>
	// @ts-nocheck

	import Logo from '$lib/assets/pie-chart-logo.svg';
	import { page } from '$app/state';

	function handleReload(event) {
		// If we're already on the home page, reload instead of navigating
		if (page.url.pathname === '/') {
			event.preventDefault();
			window.location.reload();
		}
	}
</script>

<header class="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 border-b border-slate-300/20 shadow-lg">
	<div class="header-content mx-auto px-6 py-3">
		<div class="flex items-center justify-between">
			<!-- Logo Section - Far Left -->
			<div class="flex items-center">
				<a href="/" class="flex items-center hover:opacity-80 transition-opacity duration-200">
					<img src={Logo} alt="Logo" class="w-8 h-8" />
				</a>
			</div>

			<!-- Navigation Links - Center -->
			<div class="absolute left-1/2 transform -translate-x-1/2">
				<nav class="flex items-center space-x-6">
					<a
						on:click={handleReload}
						href="/"
						class="px-3 py-2 text-white hover:text-white/80 transition-colors duration-200 font-medium"
					>
						Начало
					</a>
					<a
						href="/info"
						class="px-3 py-2 text-white hover:text-white/80 transition-colors duration-200 font-medium"
					>
						Информация за проекта
					</a>
				</nav>
			</div>

			<!-- GitHub Button - Far Right -->
			<div class="flex items-center">
				<a
					id="github-social-button"
					aria-label="Github"
					target="_blank"
					href="https://github.com/MiroslavRusev/consumer-price-tracker"
					class="inline-flex items-center justify-center w-9 h-9 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
				>
					<!-- GitHub Mark SVG, from https://github.com/logos -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 16 16"
						fill="currentColor"
					>
						<path
							d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
							0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
							-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
							-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65
							7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
							2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
							1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</header>
