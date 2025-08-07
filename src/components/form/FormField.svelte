<script lang="ts">
	import { FORM_FIELD_CONFIG } from '$lib/utils/formDataBuilder';
	import { validateField } from '$lib/utils/formValidator';
	import { svgExporter } from '$lib/assets/svgExporter';

	export let fieldName: keyof typeof FORM_FIELD_CONFIG;
	export let value: string;
	export let disabled: boolean = false;
	export let containerClass: string = '';
	export let iconSvg: string = '';
	export let placeholder: string = '';
	export let readonly: boolean = false;

	// Get field configuration
	$: config = FORM_FIELD_CONFIG[fieldName];

	// Simple validation using the centralized function
	$: validation = validateField(fieldName, value);

	// Dynamic styling based on validation state
	$: inputClasses = (() => {
		const baseClasses = 'w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-lg';

		if (validation.isEmpty) {
			return `${baseClasses} border-gray-300 focus:ring-gray-500`;
		}

		return validation.isValid ? `${baseClasses} border-green-500 focus:ring-green-500` : `${baseClasses} border-red-300 focus:ring-red-500`;
	})();
</script>

<div class={`${containerClass} rounded-xl p-6`}>
	<label class="block">
		<div class="flex items-center mb-3">
			{#if iconSvg}
				{@html iconSvg}
			{/if}
			<span class="text-lg font-semibold">{config.displayName}</span>
		</div>
		<input
			bind:value
			class={inputClasses}
			type="text"
			inputmode="numeric"
			name={config.key}
			{placeholder}
			required={config.required}
			{disabled}
			{readonly}
		/>
		{#if !validation.isEmpty && validation.isValid}
			<div class="flex items-center mt-2 text-green-600 text-sm">
				{@html svgExporter.greenCheck}
				Валидно
			</div>
		{:else if !validation.isValid}
			<div class="flex items-center mt-2 text-red-600 text-sm">
				{@html svgExporter.redCheck}
				{validation.errorMessage}
			</div>
		{/if}
	</label>
</div>
