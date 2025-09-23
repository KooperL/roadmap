<script lang="ts">
	import { EditOutline } from 'flowbite-svelte-icons';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { getPriority } from '$lib/config';
	import type { CardListPrettyColumn } from '$lib/types';

	export let projectId = undefined;
	export let cards: { [key: string]: CardListPrettyColumn } = {};
	export let canEdit = false;

	function openCard(cardId: string) {
		window.location.assign(`cards?cardId=${cardId}`);
	}

	function editCard(cardId: string) {
		window.location.assign(`update?cardId=${cardId}`);
	}
</script>

<Table class="mb-8">
	<TableHead>
		<TableHeadCell>Title</TableHeadCell>
		<TableHeadCell>Category</TableHeadCell>
		<TableHeadCell>Priority</TableHeadCell>
		<TableHeadCell>Status</TableHeadCell>
		<TableHeadCell>Actions</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each Object.values(cards)
			.map((i) => i.cards)
			.flat() as card}
			<TableBodyRow
				on:click={() => openCard(card.card)}
				class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
			>
				<TableBodyCell>{card.title}</TableBodyCell>
				<TableBodyCell>{card.category}</TableBodyCell>
				<TableBodyCell>{getPriority(card.priority)[1]}</TableBodyCell>
				<TableBodyCell>{card.status}</TableBodyCell>
				<TableBodyCell>
					{#if canEdit}
						<div
							on:click={() => editCard(card.card)}
							class="flex h-full items-center justify-center rounded bg-gray-100 px-2 py-2 hover:bg-gray-200"
						>
							<EditOutline class="h-3 w-3" />
						</div>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
