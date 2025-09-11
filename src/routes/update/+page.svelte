<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getCard, updateCard, resetGetCard } from '$lib/hooks/cards';
	import { cardState, projectsState, fetchStatus, toast, updateCardState } from '$lib/app/stores';
	import { Label, Select, Input, Textarea, Button } from 'flowbite-svelte';
	import { getProjects } from '$lib/hooks/projects';
	import { site } from '$lib/config';

	let categoriesList: { value: string; name: string }[] = [];
	let statusList: { value: string; name: string }[] = [];
	let priorityList = [
		{ value: 3, name: 'Low' },
		{ value: 4, name: 'Medium' },
		{ value: 6, name: 'High' },
		{ value: 8, name: 'Critical' }
	];

	let cardId = '';
	let title = '';
	let body = '';
	let category = '';
	let priority = '';
	let status = '';
	let tags = '';

	let originalTitle = '';
	let originalBody = '';
	let originalCategory = '';
	let originalPriority = '';
	let originalStatus = '';
	let originalTags = '';

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		cardId = urlParams.get('cardId') || '';

		if (!cardId) {
			toast.set({ text: 'No card ID provided', icon: 'error' });
			goto('/');
			return;
		}

		if ($projectsState.status !== fetchStatus.success) {
			await getProjects();
		}

		await getCard(cardId);

		categoriesList = $projectsState.data[0].expand.workflow.expand.categories.map((cat: any) => ({
			value: cat.id,
			name: cat.name
		}));
		statusList = $projectsState.data[0].expand.workflow.expand.statuses.map((stat: any) => ({
			value: stat.id,
			name: stat.name
		}));

		if ($cardState.status === fetchStatus.success && $cardState.data) {
			const card = $cardState.data;
			title = card.title || '';
			body = card.body || '';
			category = categoriesList.find((cat) => cat.name === card.category)?.value || '';
			priority = card.priority || '';
			status = statusList.find((stat) => stat.name === card.status)?.value || '';
			tags = card.tags ? card.tags.join(', ') : '';

			originalTitle = title;
			originalBody = body;
			originalCategory = category;
			originalPriority = priority;
			originalStatus = status;
			originalTags = tags;
		}
	});

	async function handleSubmit() {
		if (!cardId) {
			toast.set({ text: 'No card ID available', icon: 'error' });
			return;
		}

		try {
			if (title.trim() !== originalTitle) {
				await updateCard('title_tracked', cardId, title.trim());
			}

			if (body.trim() !== originalBody) {
				await updateCard('body_tracked', cardId, body.trim());
			}

			if (status !== originalStatus) {
				await updateCard('status_tracked', cardId, status);
			}

			if (category !== originalCategory) {
				await updateCard('category_tracked', cardId, category);
			}

			if (priority !== originalPriority) {
				await updateCard('priority_tracked', cardId, priority);
			}

			if (tags !== originalTags) {
				const newTags = tags
					.split(',')
					.map((tag) => tag.trim())
					.filter((tag) => tag !== '');
				const oldTags = originalTags
					.split(',')
					.map((tag) => tag.trim())
					.filter((tag) => tag !== '');

				for (const tag of oldTags) {
					if (!newTags.includes(tag)) {
						await updateCard('meta_tracked', cardId, tag, 'remove');
					}
				}

				for (const tag of newTags) {
					if (!oldTags.includes(tag)) {
						await updateCard('meta_tracked', cardId, tag, 'add');
					}
				}
			}

			toast.set({ text: 'Card updated successfully!', icon: 'success' });
			window.location.assign(`/cards?cardId=${cardId}`);
		} catch (error) {
			console.error('Error updating card:', error);
			toast.set({ text: 'Failed to update card', icon: 'error' });
		}
	}

	function handleCancel() {
		window.location.assign(`/cards?cardId=${cardId}`);
	}

	$: hasChanges =
		title !== originalTitle ||
		body !== originalBody ||
		category !== originalCategory ||
		priority !== originalPriority ||
		status !== originalStatus ||
		tags !== originalTags;
</script>

<svelte:head>
	<title>Update Card | {site.name}</title>
</svelte:head>

<div class="container mx-auto max-w-2xl p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Update Card</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">Modify the card details below</p>
	</div>

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
			<p class="text-red-700 dark:text-red-300">Error loading card: {$cardState.errorMessage}</p>
			<Button class="mt-4" on:click={() => goto('/')}>Go Back Home</Button>
		</div>
	{:else if $cardState.status === fetchStatus.success}
		<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
			<div>
				<Label for="title" class="mb-2">Title *</Label>
				<Input
					id="title"
					bind:value={title}
					placeholder="Enter card title..."
					required
					class="w-full"
				/>
			</div>

			<div>
				<Label for="body" class="mb-2">Description *</Label>
				<Textarea
					id="body"
					bind:value={body}
					placeholder="Enter card description..."
					rows={4}
					required
					class="w-full"
				/>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label for="category" class="mb-2">Category *</Label>
					{#if $projectsState.status === fetchStatus.loading}
						<div class="text-sm text-gray-500">Loading categories...</div>
					{:else if $projectsState.status === fetchStatus.success}
						<Select class="mt-2" items={categoriesList} bind:value={category} />
					{:else}
						<div class="text-sm text-gray-500">No categories available</div>
					{/if}
				</div>

				<div>
					<Label for="status" class="mb-2">Status *</Label>
					{#if $projectsState.status === fetchStatus.loading || $projectsState.status === fetchStatus.idle}
						<div class="text-sm text-gray-500">Loading statuses...</div>
					{:else if $projectsState.status === fetchStatus.success}
						<Select class="mt-2" items={statusList} bind:value={status} />
					{:else}
						<div class="text-sm text-gray-500">No statuses available</div>
					{/if}
				</div>
			</div>

			<div>
				<Label for="priority" class="mb-2">Priority</Label>
				<Select class="mt-2" items={priorityList} bind:value={priority} />
			</div>

			<div>
				<Label for="tags" class="mb-2">Tags</Label>
				<div class="rounded-lg border border-gray-300 p-3 dark:border-gray-600">
					<Input bind:value={tags} placeholder="Add tags separated by commas" />
				</div>
				<p class="mt-1 text-sm text-gray-500">Add tags separated by commas</p>
			</div>

			<div class="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end">
				<Button
					type="button"
					on:click={handleCancel}
					class="order-2 bg-gray-500 hover:bg-gray-600 sm:order-1"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={!hasChanges || $updateCardState.status === fetchStatus.loading}
					class="order-1 sm:order-2 {!hasChanges ? 'cursor-not-allowed opacity-50' : ''}"
				>
					{#if $updateCardState.status === fetchStatus.loading}
						Updating...
					{:else}
						Update Card
					{/if}
				</Button>
			</div>

			{#if !hasChanges}
				<p class="text-center text-sm text-gray-500">No changes to save</p>
			{/if}
		</form>
	{/if}
</div>
