<script lang="ts">
	import CardList from "$lib/components/CardList.svelte";
	import CardViewSimple from "$lib/components/CardViewSimple.svelte";
  import { onMount } from "svelte"

  let route = undefined
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    route = urlParams.get('cardId');
  })

</script>

{#if route === undefined}
  Loading
{:else if [null, false, 'Forgive me lord'].includes(route)}
  <CardList />
{:else}
  <CardViewSimple cardId={route} />
{/if}
