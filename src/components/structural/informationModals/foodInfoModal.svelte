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

<!-- Modal backdrop -->
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
					<span class="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
					Информация за храните
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
					<strong>Хармонизиран индекс на потребителските цени (ХИПЦ)</strong>
				</p>
				<p>
					Този график показва промените в цените на храните въз основа на официалните данни от Евростат. Индексът използва 2015 година като
					базова година (2015=100).
				</p>
				<div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
					<h4 class="font-semibold text-green-800 mb-2">Как да четете графиката:</h4>
					<ul class="list-disc list-inside space-y-1 text-green-700">
						<li>Стойност над 100 означава, че цените са се увеличили спрямо 2015 г.</li>
						<li>Стойност под 100 означава, че цените са се намалили спрямо 2015 г.</li>
						<li>По-стръмни линии показват по-бързи промени в цените</li>
					</ul>
				</div>
				<p>
					<strong>Източник:</strong> Евростат - Европейска статистическа служба
				</p>
				<p class="text-sm text-gray-500">Данните се актуализират ежемесечно и отразяват официалните статистики на ЕС.</p>
			</div>
		</div>
	</div>
</div>
