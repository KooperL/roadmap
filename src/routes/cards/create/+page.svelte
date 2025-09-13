<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createCard, resetCreateCard } from '$lib/hooks/cards';
	import { createCardState, projectsState, fetchStatus, toast } from '$lib/app/stores';
	import { Label, Select, Input, Textarea, Button } from 'flowbite-svelte';
	import { getProjects } from '$lib/hooks/projects';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { site } from '$lib/config';

	let categoriesList: { value: string; name: string }[] = [];
	let statusList: { value: string; name: string }[] = [];
	let priorityList = [
		{ value: 3, name: 'Low' },
		{ value: 4, name: 'Medium' },
		{ value: 6, name: 'High' },
		{ value: 8, name: 'Critical' }
	];
	let projectList: { value: string; name: string }[] = [];

	let projectId = '';
	let title = '';
	let body = '';
	let category = '';
	let priority = '';
	let status = '';
	let tags = '';

	onMount(async () => {
		if ($projectsState.status !== fetchStatus.success) {
			await getProjects();
		}

		if ($projectsState.status !== fetchStatus.success) {
			await getProjects();
		}

		projectList = $projectsState.data.map((proj: any) => ({ value: proj.id, name: proj.name }));
	});

	async function handleSubmit() {
		const cardDetails = {
			title: title.trim(),
			body: body.trim(),
			category,
			priority,
			status,
			tags: tags
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag !== ''),
			project: projectId
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

	$: statusList = $projectsState.data
		?.find?.((proj) => proj.id === projectId)
		?.expand?.workflow?.expand?.statuses?.map?.((stat) => ({
			value: stat.id,
			name: stat.name
		}));

	$: categoriesList = $projectsState.data
		?.find?.((proj) => proj.id === projectId)
		?.expand?.workflow?.expand?.categories?.map?.((cat) => ({
			value: cat.id,
			name: cat.name
		}));
</script>

<svelte:head>
	<title>Create Card | {site.name}</title>
</svelte:head>

<PageLayout title="Create New Card" description="Fill in the details to create a new roadmap card">
	<form class="space-y-6">
		<div>
			<Label for="project" class="mb-2">Project</Label>
			<Select class="mt-2" items={projectList} bind:value={projectId} />
		</div>

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
				rows="4"
				required
				className="w-full"
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
</PageLayout>
