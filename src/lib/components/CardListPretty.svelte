<script lang="ts">
	import { EditOutline } from 'flowbite-svelte-icons';
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

	function getVisibleStatusesForProject(): [string, CardListPrettyColumn][] {
		return Object.entries(cards).sort(
			([, a], [, b]: [string, CardListPrettyColumn]) => a.position - b.position
		);
	}
</script>

<div class="flex justify-center gap-4 overflow-x-auto pb-4">
	{#each getVisibleStatusesForProject() as [statusName, statusData]}
		<div class="w-80 flex-shrink-0">
			<div
				class="rounded-t-lg border-b bg-gray-100 px-4 py-3 dark:bg-gray-800 {statusData.isTerminal
					? 'border-green-300 dark:border-green-600'
					: statusData.isActive
						? 'border-blue-300 dark:border-blue-600'
						: 'border-gray-300 dark:border-gray-600'}"
			>
				<h3
					class="font-semibold text-gray-900 dark:text-white {statusData.isTerminal
						? 'text-green-700 dark:text-green-400'
						: statusData.isActive
							? 'text-blue-700 dark:text-blue-400'
							: ''}"
				>
					{statusName}
					{#if statusData.isTerminal}
						<span class="ml-1 text-xs">✓</span>
					{:else if statusData.isActive}
						<span class="ml-1 text-xs">⚡</span>
					{/if}
				</h3>
				<span class="text-sm text-gray-500 dark:text-gray-400">
					{statusData.cards.length} cards
				</span>
			</div>

			<div
				class="h-96 max-h-96 space-y-3 overflow-y-auto rounded-b-lg bg-gray-50 p-3 dark:bg-gray-900 {statusData.isTerminal
					? 'bg-green-50 dark:bg-green-900/20'
					: statusData.isActive
						? 'bg-blue-50 dark:bg-blue-900/20'
						: ''}"
			>
				{#each statusData.cards as card}
					<div
						class="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
						role="button"
						tabindex="0"
						on:click={() => openCard(card.card)}
						on:keydown={(e) => e.key === 'Enter' && openCard(card.card)}
					>
						<h4 class="mb-2 line-clamp-2 font-medium text-gray-900 dark:text-white">
							{card.title}
						</h4>

						<div class="mb-3 flex flex-wrap gap-2">
							{#if card.category}
								<span
									class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
								>
									{card.category}
								</span>
							{/if}

							<span
								class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getPriority(
									card.priority
								)[0] === 'black'
									? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
									: getPriority(card.priority)[0] === 'red'
										? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
										: getPriority(card.priority)[0] === 'yellow'
											? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
											: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'}"
							>
								{getPriority(card.priority)[1]}
							</span>
						</div>

						{#if canEdit}
							<div class="flex justify-end">
								<button
									on:click|stopPropagation={() => editCard(card.card)}
									class="rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
									title="Edit card"
								>
									<EditOutline class="h-4 w-4 text-gray-500 dark:text-gray-400" />
								</button>
							</div>
						{/if}
					</div>
				{/each}

				{#if statusData.cards.length === 0}
					<div class="py-8 text-center">
						<p class="text-sm text-gray-500 dark:text-gray-400">No cards in {statusName}</p>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
