<script>
	export let title;
	export let description;
</script>

<div class="container mx-auto max-w-2xl p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
		{#if description}
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				{description}
			</p>
		{/if}
	</div>
	<slot />
</div>
