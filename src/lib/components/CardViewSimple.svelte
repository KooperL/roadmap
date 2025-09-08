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
	import TextArea from './TextArea.svelte';
	import { Textarea, Input, Heading, P } from 'flowbite-svelte';
	import { ClockSolid, FloppyDiskOutline, PenOutline, EditOutline } from 'flowbite-svelte-icons';
	import Chip from './Chip.svelte';
	import Button from './Button.svelte';
	import moment from 'moment';
	import CardComments from './CardComments.svelte';

	export let cardId: string;
	const dispatch = createEventDispatcher();

	onMount(async () => {
		if ($cardState.status != fetchStatus.success || $cardState.data.id !== cardId) {
		  await getCard(cardId);
		}
	});


	async function handleDelete() {
		await deleteCard(cardId);
		resetGetCards();
	}

</script>

<div class="max-w-4xl mx-auto p-6">
	{#if $cardState.status === fetchStatus.loading || $cardState.status === fetchStatus.idle}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 animate-pulse">
			<div class="flex items-center justify-center space-x-2">
				<div class="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-spin"></div>
				<p class="text-gray-600 dark:text-gray-300 text-lg">Loading card...</p>
			</div>
		</div>
	{:else if $cardState.status === fetchStatus.error}
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
			<div class="flex items-center space-x-3">
				<div class="flex-shrink-0">
					<svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div>
					<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error loading card</h3>
					<p class="text-sm text-red-600 dark:text-red-400 mt-1">{$cardState.errorMessage}</p>
				</div>
			</div>
		</div>
	{:else if $cardState.data}
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
			<div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center space-x-3">
						<Chip rounded color="gray" className="bg-white">
							{$cardState.data.category}
						</Chip>
						<Chip border className="bg-white dark:bg-gray-800">
							<ClockSolid class="me-1.5 h-2.5 w-2.5 text-primary-800 dark:text-primary-400" />
							{moment($cardState.data.created).fromNow()}
						</Chip>
					</div>
					<div class="flex items-center space-x-2">
						<Chip color={getPriority($cardState.data.priority)[0]} className="font-semibold">
							{getPriority($cardState.data.priority)[1]}
						</Chip>
						<Chip border color="gray" className="bg-gray-400">
							{$cardState.data.status}
						</Chip>
					</div>
				</div>
			</div>

			<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<Heading tag="h1" class="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
						{$cardState.data.title}
					</Heading>
					<Button 
						click={() => window.location.assign(`/update?cardId=${cardId}`)}
						className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
					>
						<EditOutline class="h-4 w-4" />
						<span>Edit</span>
					</Button>
				</div>
			</div>

			<div class="px-6 py-6">
				<div class="mb-6">
					<Textarea 
						disabled 
						bind:value={$cardState.data.body} 
						class="min-h-32 resize-none bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
						placeholder="No description available..."
					/>
				</div>

				{#if $cardState.data.tags && $cardState.data.tags.length > 0}
					<div class="mb-6">
						<div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							Tags
						</div>
						<div class="flex flex-wrap gap-2">
							{#each $cardState.data.tags as tag}
								<Chip 
									rounded 
									color="indigo" 
									className="px-3 py-1 text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
								>
									{typeof tag === 'object' ? tag.name : tag}
								</Chip>
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
