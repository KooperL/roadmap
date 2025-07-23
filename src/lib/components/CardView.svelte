<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getCard,
		updateCard,
		deleteCard,
		getCards,
		cardComment,
		fetchCreateTags,
		resetGetCards
	} from '../hooks/cards';
	import { cardState, fetchCreateTagState, fetchStatus } from '../app/stores';
	import { createEventDispatcher } from 'svelte';
	import TagInput from './TagInput.svelte';
	import CategorySelector from './CategorySelector.svelte';
	import StatusSelector from './StatusSelector.svelte';
	import PrioritySelector from './PrioritySelector.svelte';
	import { cardPriority } from '../config';
	import TextArea from './TextArea.svelte';
	import { Textarea, Input, Heading, P } from 'flowbite-svelte';
	import { ClockSolid, FloppyDiskOutline, PenOutline } from 'flowbite-svelte-icons';
	import Chip from './Chip.svelte';
	import Button from './Button.svelte';
	import moment from 'moment';

	let cardId: string;
	const dispatch = createEventDispatcher();

	let editing = false;
	let title = '';
	let body = '';
	let status = '';
	let priority = cardPriority.MEDIUM; // Default to MEDIUM
	let tags: (string | { name: string; id?: string })[] = [];
	let selectedCategory: string | null = null;
	let commentDraft = '';

	onMount(async () => {
		if ($cardState.status === fetchStatus.success) {
			cardId = $cardState!.data!.id;
		}
		// await getCard(cardId);
	});

	$: cardId = $cardState?.data?.id ?? '';

	$: if ($cardState.data && !editing) {
		title = $cardState.data.title;
		body = $cardState.data.body;
		status = $cardState.data.status;
		priority = $cardState.data.priority || 5;
		tags = $cardState.data?.expand?.tags ?? [];
		selectedCategory = $cardState.data.category || null;
	}

	async function handleSave() {
		if (tags.length)
			await fetchCreateTags(
				'',
				tags.map((tag) => {
					return typeof tag === 'object' ? tag.name : tag;
				})
			);
		let desiredTags: any[] = [];
		if ($fetchCreateTagState.status === fetchStatus.success) {
			desiredTags = $fetchCreateTagState.data;
		}

		await updateCard(cardId, {
			...(title !== $cardState.data.title && { title }),
			...(body !== $cardState.data.body && { body }),
			...(status !== $cardState.data.status && { status }),
			...(priority !== $cardState.data.priority && { priority }),
			tags: desiredTags.map((record: any) => record.id),
			...(selectedCategory !== $cardState.data.category && { category: selectedCategory })
		});
		editing = false;
		await getCard(cardId);
		getCards('');
		dispatch('updated');
	}

	async function handleCommentSubmit() {
		await cardComment(cardId, commentDraft);
		commentDraft = '';
		await getCard(cardId);
	}

	async function handleDelete() {
		await deleteCard(cardId);
		resetGetCards();
		dispatch('deleted');
	}

	function close() {
		dispatch('close');
	}

	function getPriorityName(priorityValue: number): string {
		const entries = Object.entries(cardPriority);
		const entry = entries.find(([key, value]) => value === priorityValue);
		return entry ? entry[0] : 'MEDIUM';
	}

	function getPriorityColor(priorityValue: number): string {
		switch (priorityValue) {
			case cardPriority.CRITICAL:
				return 'red';
			case cardPriority.HIGH:
				return 'yellow';
			case cardPriority.MEDIUM:
			case cardPriority.LOW:
			default:
				return 'indigo';
		}
	}
</script>

<div
	class="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-primary-100/60 via-white/70 to-secondary-100/60 backdrop-blur-[6px] transition-all duration-300"
	on:click|self={close}
>
	<div
		class="animate-fade-in relative flex max-h-[90vh] w-full min-w-[320px] max-w-[95vw] flex-col gap-2 overflow-auto rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-2xl sm:w-[420px]"
	>
		{#if $cardState.status === fetchStatus.loading || $cardState.status === fetchStatus.idle}
			<p class="">Loading card...</p>
		{:else if $cardState.status === fetchStatus.error}
			<p class="">Error loading card: {$cardState.errorMessage}</p>
		{:else if $cardState.data}
			{#if editing}
				<div class="">
					<div class="">
						{selectedCategory}
					</div>
					<Input type="text" bind:value={title} placeholder="Title" class="" />
				</div>
				<StatusSelector bind:selectedStatus={status} />
				<PrioritySelector bind:selectedPriority={priority} />
				<div class="">
					<Textarea bind:value={body} rows={5} />
				</div>
				<div class="">
					<label class="">Tags:</label>
					<TagInput bind:tags />
				</div>
				<div class="flex justify-between align-middle">
					<div>
						<Button click={handleSave} color="green">
							<FloppyDiskOutline class="me-2 h-4 w-4" />
							Save
						</Button>
					</div>
					<div>
						<Button click={() => (editing = false)}>Cancel</Button>
						<Button click={handleDelete} color="red">Delete</Button>
					</div>
				</div>
			{:else}
				<div class="">
					<div class="flex justify-between">
						{$cardState.data.expand?.category?.name}
						<Chip border>
							<ClockSolid class="me-1.5 h-2.5 w-2.5 text-primary-800 dark:text-primary-400" />
							{moment($cardState.data.created).fromNow()}
						</Chip>
						<Chip color={getPriorityName(priority)}>
							{getPriorityName(priority)}
						</Chip>
					</div>
					<div class="flex justify-between">
						<Heading tag="h2" class="text-4xl font-extrabold ">{title}</Heading>
						<StatusSelector bind:selectedStatus={status} />
					</div>
				</div>
				<Textarea disabled bind:value={body} />
				<div class="flex flex-wrap gap-2">
					{#each tags as tag}
						<Chip rounded color="indigo">{typeof tag === 'object' ? tag.name : tag}</Chip>
					{/each}
				</div>
				<div class="flex justify-between align-middle">
					<Button class="" click={() => (editing = true)}>
						<PenOutline class="me-2 h-4 w-4" />
						Edit
					</Button>
					<Button class="" click={close}>Close</Button>
				</div>
				<hr />
				<div class="flex gap-2">
					<Input
						placeholder="Is there anything you'd like to add?"
						bind:value={commentDraft}
						class=""
					/>
					<Button class="" click={handleCommentSubmit} disabled={!commentDraft.trim()}>Post</Button>
				</div>
				<div class="flex flex-col gap-2">
					{#if $cardState.data?.expand?.comment_via_card?.length}
						{#each $cardState.data.expand.comment_via_card as commentObject}
							<div class="">
								<P size="xs" class="text-gray-700 dark:text-gray-500"
									>{new Date(commentObject.created).toLocaleString()}</P
								>
								<P size="">{commentObject.body}</P>
							</div>
						{/each}
					{:else}
						<div class="">No comments yet.</div>
					{/if}
				</div>
			{/if}
		{:else}
			<p class="">Card not found.</p>
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(24px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
