<script lang="ts">
	import CardList from '$lib/components/CardList.svelte';
	import CardViewSimple from '$lib/components/CardViewSimple.svelte';
	import { onMount } from 'svelte';

	let route: string | undefined = undefined;
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('cardId')) {
			route = urlParams.get('cardId');
		}
	});
</script>

{#if route === undefined}
	Card not found
{:else}
	<CardViewSimple cardId={route} />
{/if}
