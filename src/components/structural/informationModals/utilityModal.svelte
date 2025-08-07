<script lang="ts">
	import { svgExporter } from '$lib/assets/svgExporter';

	export let closeModal: () => void;

	const stopPropagation = (e: Event) => {
		e.stopPropagation();
	};
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeModal();
		}
	};
</script>

<div
	class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
	onclick={closeModal}
	onkeydown={handleKeyDown}
	role="button"
	tabindex="0"
>
	<div
		class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
		onclick={stopPropagation}
		onkeydown={handleKeyDown}
		role="dialog"
		tabindex="0"
	>
		<div class="p-6">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-2xl font-bold text-gray-900 flex items-center">
					<span class="w-4 h-4 bg-yellow-500 rounded-full mr-3"></span>
					Информация за комуналните услуги
				</h3>
				<button
					class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
					onclick={closeModal}
					aria-label="Затвори"
				>
					{@html svgExporter.closeModal}
				</button>
			</div>
			<div class="space-y-4 text-gray-600">
				<p class="text-lg">
					<strong>Цени на комунални услуги</strong>
				</p>
				<p>
					Графиката показва развитието на цените за основните комунални услуги като електричество и водоснабдяване за периода от 2015 година
					до днес.
				</p>
				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
					<h4 class="font-semibold text-yellow-800 mb-2">Особености на данните:</h4>
					<ul class="list-disc list-inside space-y-1 text-yellow-700">
						<li>Данните се актуализират на всеки 6 месеца</li>
						<li>Цените са в лева за стандартна единица потребление</li>
						<li>Включват всички съпътстващи такси и данъци</li>
						<li>Отразяват средните цени за България</li>
					</ul>
				</div>
				<p>
					<strong>Включени услуги:</strong> Електричество (kWh), Водоснабдяване (m³)
				</p>
				<p class="text-sm text-gray-500">Източници: Eurostat и Софийска вода.</p>
			</div>
		</div>
	</div>
</div>
