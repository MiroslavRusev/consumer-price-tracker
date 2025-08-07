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
					<span class="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
					Информация за горивата
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
					<strong>Цени на горива</strong>
				</p>
				<p>
					Графиката показва динамиката на цените на основните горива в България - бензин, дизел, автогаз (LPG) и метан. Данните отразяват
					средните национални цени на дребно.
				</p>
				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
					<h4 class="font-semibold text-blue-800 mb-2">Показаната цена е крайна и включва:</h4>
					<ul class="list-disc list-inside space-y-1 text-blue-700">
						<li>Цена на суровината (нефт/газ)</li>
						<li>Акцизи и данъци</li>
						<li>Търговски надценки</li>
						<li>Транспортни и логистични разходи</li>
					</ul>
				</div>
				<p>
					<strong>Видове горива:</strong> Безоловен бензин А-95, Дизелово гориво, Автогаз (LPG), Метан (CNG)
				</p>
				<p>
					<strong>Актуализация:</strong> Данните се обновяват ежеседмично въз основа на информация от бензиностанциите в цялата страна.
				</p>
				<p class="text-sm text-gray-500">Източник: Fuelo.bg.</p>
			</div>
		</div>
	</div>
</div>
