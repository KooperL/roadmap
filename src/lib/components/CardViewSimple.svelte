<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getCard,
		updateCard,
		deleteCard,
		getCards,
		cardComment,
		resetGetCards
	} from '../hooks/cards';
	import { cardState, fetchStatus } from '../app/stores';
	import { createEventDispatcher } from 'svelte';
	import TagInput from './TagInput.svelte';
	import { cardPriority, getPriority } from '../config';
	import { Textarea, Input, Heading, P, Badge, Button } from 'flowbite-svelte';
	import { ClockSolid, FloppyDiskOutline, PenOutline, EditOutline } from 'flowbite-svelte-icons';
	import moment from 'moment';
	import CardComments from './CardComments.svelte';
	import { pb } from '$lib/pocketbase';

	export let cardId: string;

	let isAuthenticated = false;

	onMount(async () => {
		if ($cardState.status != fetchStatus.success || $cardState.data.id !== cardId) {
			await getCard(cardId);
		}
		if (pb.authStore.isValid) {
			isAuthenticated = true;
		}
	});

	async function handleDelete() {
		await deleteCard(cardId);
		resetGetCards();
	}
</script>

<div class="mx-auto max-w-4xl p-6">
	{#if $cardState.status === fetchStatus.loading || $cardState.status === fetchStatus.idle}
		<div class="animate-pulse rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
			<div class="flex items-center justify-center space-x-2">
				<div class="h-6 w-6 animate-spin rounded-full bg-gray-300 dark:bg-gray-600"></div>
				<p class="text-lg text-gray-600 dark:text-gray-300">Loading card...</p>
			</div>
		</div>
	{:else if $cardState.status === fetchStatus.error}
		<div
			class="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20"
		>
			<div class="flex items-center space-x-3">
				<div class="flex-shrink-0">
					<svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error loading card</h3>
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{$cardState.errorMessage}</p>
				</div>
			</div>
		</div>
	{:else if $cardState.data}
		<div
			class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<div
				class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:from-gray-700 dark:to-gray-600"
			>
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center space-x-3">
						<Badge rounded color="gray" className="bg-white">
							{$cardState.data.category}
						</Badge>
						<Badge border class="bg-white dark:bg-gray-800">
							<ClockSolid class="me-1.5 h-2.5 w-2.5 text-primary-800 dark:text-primary-400" />
							{moment($cardState.data.created).fromNow()}
						</Badge>
					</div>
					<div class="flex items-center space-x-2">
						<Badge color={getPriority($cardState.data.priority)[0]} className="font-semibold">
							{getPriority($cardState.data.priority)[1]}
						</Badge>
						<Badge border color="gray" className="bg-gray-400">
							{$cardState.data.status}
						</Badge>
					</div>
				</div>
			</div>

			<div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<Heading tag="h1" class="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
						{$cardState.data.title}
					</Heading>
					{#if isAuthenticated}
						<Button
							on:click={() => window.location.assign(`/update?cardId=${cardId}`)}
							class="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							<EditOutline class="h-4 w-4" />
							<span>Edit</span>
						</Button>
					{/if}
				</div>
			</div>

			<div class="px-6 py-6">
				<div class="mb-6">
					<Textarea
						disabled
						bind:value={$cardState.data.body}
						class="min-h-32 resize-none border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-blue-400 dark:focus:ring-blue-400"
						placeholder="No description available..."
					/>
				</div>

				{#if $cardState.data.tags && $cardState.data.tags.length > 0}
					<div class="mb-6">
						<div class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</div>
						<div class="flex flex-wrap gap-2">
							{#each $cardState.data.tags as tag}
								<Badge
									rounded
									color="indigo"
									class="transform px-3 py-1 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
								>
									{typeof tag === 'object' ? tag.name : tag}
								</Badge>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			<hr />
			<div class="p-4">
				<CardComments />
			</div>
		</div>
	{/if}
</div>
