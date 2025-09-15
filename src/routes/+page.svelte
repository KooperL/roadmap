<script lang="ts">
	import CardList from '$lib/components/CardList.svelte';
	import CardListPretty from '$lib/components/CardListPretty.svelte';
	import CardViewSimple from '$lib/components/CardViewSimple.svelte';
	import { site } from '$lib/config';
	import { onMount } from 'svelte';

	onMount(() => {});
</script>
<svelte:head>
	<title>Cards | {site.name}</title>
</svelte:head>

<CardListPretty />
