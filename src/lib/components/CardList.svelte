<script lang="ts">
	import { onMount } from 'svelte';
	import { getCard, getCards, resetGetCard, updateCard } from '$lib/hooks/cards';
	import { fetchStatus, cardsState, cardState, projectsState } from '$lib/app/stores';
	import Button from '$lib/components/Button.svelte';
	import { PlusOutline, EditOutline } from 'flowbite-svelte-icons';
	import { getProjects } from '$lib/hooks/projects';
	import {
		ListPlaceholder,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { getPriority } from '$lib/config';

	let isAuthenticated = false;
	function getCardsByStatus(status: string): any[] {
		return $cardsState.data.filter((card: any) => card.status === status);
	}

	onMount(async () => {
		if ($projectsState.status !== fetchStatus.success) {
			getProjects();
		}

		if (pb.authStore.isValid) {
			isAuthenticated = true;
		}

		if ($cardsState.status !== fetchStatus.success) {
			await getCards($projectsState.data?.id);
		}
	});

	function openCard(cardId: string) {
		window.location.assign(`cards?cardId=${cardId}`);
	}

	function editCard(cardId: string) {
		window.location.assign(`update?cardId=${cardId}`);
	}
</script>

<div class="">
	{#if fetchStatus.loading === $cardsState.status || fetchStatus.idle === $cardsState.status || fetchStatus.loading === $projectsState.status || fetchStatus.idle === $projectsState.status}
		<ListPlaceholder divClass="w-full" />
	{:else if $cardsState.status === fetchStatus.error || $projectsState.status === fetchStatus.error}
		<ListPlaceholder divClass="w-full" />
	{:else}
		{#each $projectsState.data as project}
			<div class="mb-4 flex items-center justify-between">
				<h2 class="pl-4 text-2xl font-bold text-gray-900 dark:text-white">
					{project.name}
				</h2>
			</div>

			<Table class="mb-8">
				<TableHead>
					<TableHeadCell>Title</TableHeadCell>
					<TableHeadCell>Category</TableHeadCell>
					<TableHeadCell>Priority</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
					<TableHeadCell>Actions</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each $cardsState.data as card}
						{#if card.project === project.name}
							<TableBodyRow
								on:click={() => openCard(card.card)}
								class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
							>
								<TableBodyCell>{card.title}</TableBodyCell>
								<TableBodyCell>{card.category}</TableBodyCell>
								<TableBodyCell>{getPriority(card.priority)[1]}</TableBodyCell>
								<TableBodyCell>{card.status}</TableBodyCell>
								<TableBodyCell>
									{#if isAuthenticated}
										<div
											on:click={() => editCard(card.card)}
											class="flex h-full items-center justify-center rounded bg-gray-100 px-2 py-2 hover:bg-gray-200"
										>
											<EditOutline class="h-3 w-3" />
										</div>
									{/if}
								</TableBodyCell>
							</TableBodyRow>
						{/if}
					{/each}
				</TableBody>
			</Table>
		{/each}
	{/if}
</div>
``
