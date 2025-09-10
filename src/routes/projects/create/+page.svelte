<script lang="ts">
	import { createProjectState, fetchStatus, workflowState } from '$lib/app/stores';
	import { createProject, getWorkflows, resetCreateProject } from '$lib/hooks/projects';
	import { Button, Input, Label, Select } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let name = '';
	let workflowItems = [];
	let workflow = '';

	onMount(async () => {
		if ($workflowState.status !== fetchStatus.success) {
			await getWorkflows();
		}

		workflowItems = $workflowState.data.map((wf) => ({ value: wf.id, name: wf.name }));
	});

	async function handleSubmit() {
		if (!name || !workflow) {
			return;
		}
		resetCreateProject();

		await createProject(name, workflow);

		window.location.assign(`/cards/create`);
	}
</script>

<div class="container mx-auto max-w-2xl p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">Fill in the details to create a new project</p>
	</div>

	<form class="space-y-6">
		<div>
			<Label for="title" class="mb-2">Title *</Label>
			<Input
				id="title"
				bind:value={name}
				placeholder="Enter card title..."
				required
				class="w-full"
			/>
		</div>

		{#if $workflowState.status === fetchStatus.loading}
			<p>Loading workflows...</p>
		{:else if $workflowState.status === fetchStatus.error}
			<p class="text-red-500">Error loading workflows: {$workflowState.errorMessage}</p>
		{:else if $workflowState.status === fetchStatus.success}
			<Label for="project" class="mb-2">Workflow</Label>
			<Select class="mt-2" items={workflowItems} bind:value={workflow} />
		{/if}

		<div class="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end">
			<Button type="submit" on:click={handleSubmit} class="order-1 sm:order-2">
				{#if $createProjectState.status === fetchStatus.loading}
					Creating...
				{:else}
					Create Project
				{/if}
			</Button>
		</div>
	</form>
</div>
