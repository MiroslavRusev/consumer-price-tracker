<script lang="ts">
	// Footer component props
	export let showSocialLinks = true;
	export let showQuickLinks = true;

	interface CustomLink {
		href: string;
		text: string;
	}

	export let customLinks: CustomLink[] = [];

	// Function to get current year
	function getCurrentYear(): number {
		return new Date().getFullYear();
	}
</script>

<footer id="footer" class="bg-slate-600 border-t border-gray-100 mt-16">
	<div class="max-w-6xl mx-auto px-6 py-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div>
				<h3 class="text-lg font-semibold text-white mb-3 underline underline-offset-4">
					Анализатор на потребителските цени
				</h3>
				<p class="text-white leading-relaxed">
					Анализирайте отношението на потребителските цени към доходите на база инфлацията в различни периоди.
				</p>
			</div>

			{#if showQuickLinks}
				<div>
					<h3 class="text-lg font-semibold text-white mb-3 underline underline-offset-4">Източници</h3>
					<ul class="space-y-2">
						{#if customLinks.length > 0}
							{#each customLinks as link (link.href)}
								<li>
									<a href={link.href} class="text-gray-600 hover:text-gray-900 transition-colors">
										{link.text}
									</a>
								</li>
							{/each}
						{:else}
							<li>
								<a
									href="https://ec.europa.eu/eurostat/databrowser/view/prc_fsc_idx/default/table?lang=en&category=prc.prc_oth"
									class="text-white hover:text-black transition-colors">Eurostat</a
								>
							</li>
							<li>
								<a href="https://fuelo.net/" class="text-white hover:text-black transition-colors"
									>Fuelo</a
								>
							</li>
						{/if}
					</ul>
				</div>
			{/if}

			{#if showSocialLinks}
				<div>
					<h3 class="text-lg font-semibold text-white mb-3 underline underline-offset-4">
						Github source code
					</h3>
					<div class="flex space-x-3">
						<a
							href="https://github.com/MiroslavRusev/consumer-price-tracker"
							target="_blank"
							aria-label="Github"
							class="inline-flex items-center justify-center text-white hover:text-black"
						>
							<!-- GitHub Mark SVG, from https://github.com/logos -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
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
			{/if}
		</div>
		<div class="border-t border-gray-200 mt-8 pt-8 text-center">
			<p class="text-white">
				&copy; {getCurrentYear()} Анализатор на потребителските цени. Всички права запазени.
			</p>
		</div>
	</div>
</footer>
