<script lang="ts">
	import { createProjectState, fetchStatus, workflowState } from '$lib/app/stores';
	import { createProject, getWorkflows, resetCreateProject } from '$lib/hooks/projects';
	import { Button, Input, Label, Select } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { site } from '$lib/config';

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
<svelte:head>
	<title>Create Project | {site.name}</title>
</svelte:head>

<PageLayout title="Create New Project" description="Fill in the details to create a new project">
	<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
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
			<Select class="" items={workflowItems} bind:value={workflow} />
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
</PageLayout>
