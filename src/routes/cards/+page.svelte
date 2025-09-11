<script lang="ts">
	import CardList from '$lib/components/CardList.svelte';
	import CardViewSimple from '$lib/components/CardViewSimple.svelte';
	import { site } from '$lib/config';
	import { onMount } from 'svelte';

	let route: string | undefined = undefined;
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('cardId')) {
			route = urlParams.get('cardId');
		}
	});
</script>
<svelte:head>
	<title>{site.name}</title>
</svelte:head>


{#if route === undefined}
	Card not found
{:else}
	<CardViewSimple cardId={route} />
{/if}
