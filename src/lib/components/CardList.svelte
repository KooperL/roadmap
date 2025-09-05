<script lang="ts">
	import { onMount } from 'svelte';
	import { getCard, getCards, getProjectStatus, resetGetCard, updateCard } from '$lib/hooks/cards';
	import { fetchStatus, cardsState, projectStatusState, cardState, projectsState } from '$lib/app/stores';
	import CardEditor from '$lib/components/CardCreator.svelte';
	import CardView from '$lib/components/CardView.svelte';
	import LandCard from '$lib/components/LandCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { getProjects } from '$lib/hooks/projects';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { goto } from '$app/navigation';

	function getCardsByStatus(status: string): any[] {
		return $cardsState.data.filter((card: any) => card.status === status);
	}

	onMount(async () => {
		if ($projectsState.status !== fetchStatus.success) {
      getProjects()
    }
		if ($cardsState.status !== fetchStatus.success) {
			await getCards($projectsState.data?.id);
		}
		if ($projectStatusState.status !== fetchStatus.success) {
      // TODO TODO TODO
			await getProjectStatus($projectsState.data?.[0]?.workflow);
		}
	});

	function openCard(cardId: string) {
		window.location.assign(`cards?cardId=${cardId}`);
	}


	$: sortedStatuses = $projectStatusState.data
		? $projectStatusState.data.sort((a: any, b: any) => a.position - b.position)
		: [];
</script>

<div class="">

	{#if $cardsState.status === fetchStatus.loading || $cardsState.status === fetchStatus.idle}
		<p class="">Loading cards...</p>
	{:else if $cardsState.status === fetchStatus.error}
		<!-- p class="">Error pulling the cards: {$cardsState.errorMessage}</p-->
	{:else}


<Table>
  <TableHead>
    <TableHeadCell>Title</TableHeadCell>
    <TableHeadCell>Category</TableHeadCell>
    <TableHeadCell>Priority</TableHeadCell>
    <TableHeadCell>List</TableHeadCell>
  </TableHead>
  <TableBody>
				{#each $cardsState.data as card}
    <TableBodyRow on:click={() => openCard(card.card)}>
      <TableBodyCell>{card.title}</TableBodyCell>
      <TableBodyCell>{card.category}</TableBodyCell>
      <TableBodyCell>{card.priority}</TableBodyCell>
      <TableBodyCell>{card.status}</TableBodyCell>
    </TableBodyRow>
{/each}
  </TableBody>
</Table>


	{/if}
</div>
