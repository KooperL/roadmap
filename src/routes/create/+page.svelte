<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createCard, getProjectStatus, resetCreateCard } from '$lib/hooks/cards';
	import { getCategories, resetGetCategories } from '$lib/hooks/categories';
	import {
		createCardState,
		cardCategoryState,
		projectsState,
		fetchStatus,
		toast
	} from '$lib/app/stores';
	import { Label, Select, Input, Textarea, Button } from 'flowbite-svelte';
	import { getProjects } from '$lib/hooks/projects';

	let categoriesList: { value: string; name: string }[] = [];
	let statusList: { value: string; name: string }[] = [];
	let priorityList = [
		{ value: 3, name: 'Low' },
		{ value: 4, name: 'Medium' },
		{ value: 6, name: 'High' },
		{ value: 8, name: 'Critical' }
	];

	let title = '';
	let body = '';
	let category = '';
	let priority = 'medium';
	let status = '';
	let tags = '';

	onMount(async () => {
		if ($projectsState.status !== fetchStatus.success) {
			await getProjects();
		}
		if ($cardCategoryState.status !== fetchStatus.success) {
			await getCategories();
		}

		categoriesList = $cardCategoryState.data.map((cat) => ({ value: cat.id, name: cat.name }));
		statusList = $projectsState.data.items[0].expand.workflow.expand.statuses.map((stat) => ({
			value: stat.id,
			name: stat.name
		}));
	});

	async function handleSubmit() {
		if (false) {
			toast.set({ text: 'Please fill in all required fields', icon: 'error' });
			return;
		}

		const cardDetails = {
			title: title.trim(),
			body: body.trim(),
			category,
			priority,
			status,
			tags: tags
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag !== '')
		};

		await createCard(cardDetails);
	}

	$: if ($createCardState.status === fetchStatus.success) {
		toast.set({ text: 'Card created successfully!', icon: 'success' });
		window.location.assign('/');
	} else if ($createCardState.status === fetchStatus.error) {
		toast.set({ text: $createCardState.errorMessage || 'Failed to create card', icon: 'error' });
	}

	function handleCancel() {
		window.location.assign('/');
	}
</script>

<svelte:head>
	<title>Create Card | Roadmap</title>
</svelte:head>

<div class="container mx-auto max-w-2xl p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create New Card</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">
			Fill in the details to create a new roadmap card
		</p>
	</div>

	<form class="space-y-6">
		<div>
			<Label for="title" class="mb-2">Title *</Label>
			<Input
				id="title"
				bind:value={title}
				placeholder="Enter card title..."
				required
				className="w-full"
			/>
		</div>

		<div>
			<Label for="body" class="mb-2">Description *</Label>
			<Textarea
				id="body"
				bind:value={body}
				placeholder="Enter card description..."
				rows="4"
				required
				className="w-full"
			/>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="category" class="mb-2">Category *</Label>
				{#if $cardCategoryState.status === fetchStatus.loading}
					<div class="text-sm text-gray-500">Loading categories...</div>
				{:else if $cardCategoryState.status === fetchStatus.success}
					<Select class="mt-2" items={categoriesList} bind:value={category} />
				{:else}
					<div class="text-sm text-gray-500">No categories available</div>
				{/if}
			</div>

			<div>
				<Label for="status" class="mb-2">Status *</Label>
				{#if $projectsState.status === fetchStatus.loading}
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
				<Input bind:value={tags} />
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
			<Button type="submit" on:click={handleSubmit} class="order-1 sm:order-2">
				{#if $createCardState.status === fetchStatus.loading}
					Creating...
				{:else}
					Create Card
				{/if}
			</Button>
		</div>
	</form>
</div>

{#if $cardCategoryState.status === fetchStatus.error}
	<div class="mt-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
		Error loading categories: {$cardCategoryState.errorMessage}
	</div>
{/if}
