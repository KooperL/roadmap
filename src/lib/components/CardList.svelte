<script lang="ts">
	import { onMount } from 'svelte';
	import { getCard, getCards, getProjectStatus, resetGetCard, updateCard } from '$lib/hooks/cards';
	import { fetchStatus, cardsState, projectStatusState, cardState, projectsState } from '$lib/app/stores';
	import Button from '$lib/components/Button.svelte';
	import { PlusOutline, EditOutline } from 'flowbite-svelte-icons';
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

	function editCard(cardId: string) {
		window.location.assign(`update?cardId=${cardId}`);
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

<div class="mb-4 flex justify-between items-center">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Cards</h2>
	<Button click={() => goto('/cards/create')} className="bg-blue-600 hover:bg-blue-700">
		<PlusOutline class="w-4 h-4 mr-2" />
		Create
	</Button>
</div>

<Table>
  <TableHead>
    <TableHeadCell>Title</TableHeadCell>
    <TableHeadCell>Category</TableHeadCell>
    <TableHeadCell>Priority</TableHeadCell>
    <TableHeadCell>Status</TableHeadCell>
    <TableHeadCell>Actions</TableHeadCell>
  </TableHead>
  <TableBody>
				{#each $cardsState.data as card}
    <TableBodyRow on:click={() => openCard(card.card)} class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
      <TableBodyCell>{card.title}</TableBodyCell>
      <TableBodyCell>{card.category}</TableBodyCell>
      <TableBodyCell>{card.priority}</TableBodyCell>
      <TableBodyCell>{card.status}</TableBodyCell>
      <TableBodyCell>
        <Button 
          click={() => editCard(card.card)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded flex items-center space-x-1"
        >
          <EditOutline class="h-3 w-3" />
          <span>Edit</span>
        </Button>
      </TableBodyCell>
    </TableBodyRow>
{/each}
  </TableBody>
</Table>


	{/if}
</div>
