<script lang="ts">
	import CardList from '$lib/components/CardList.svelte';
	import CardListPretty from '$lib/components/CardListPretty.svelte';
	import CardViewSimple from '$lib/components/CardViewSimple.svelte';
	import { site } from '$lib/config';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { getProjects, getWorkflows } from '$lib/hooks/projects';
	import { getCard, getCards, resetGetCard, updateCard } from '$lib/hooks/cards';
	import {
		fetchStatus,
		cardsState,
		cardState,
		projectsState,
		workflowState
	} from '$lib/app/stores';
	import { ListPlaceholder } from 'flowbite-svelte';
	import type { CardListPrettyColumn } from '$lib/types';

	let route: string | null = null;
	let listView: boolean = false;
	let isAuthenticated = false;
	let cardsByStatusByProject: { [key: string]: { [key: string]: CardListPrettyColumn } } = {};

	onMount(async () => {

		if ($projectsState.status !== fetchStatus.success) {
			await getProjects();
		}

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('projectId')) {
			route = $projectsState.data.find(i => i.name = urlParams.get('projectId'))
		}
		if (urlParams.has('list') && urlParams.get('list') === 'true') {
			listView = true
		}

		if ($cardsState.status !== fetchStatus.success) {
			await getCards(route);
		}

		if ($workflowState.status !== fetchStatus.success) {
			await getWorkflows();
		}

		if (pb.authStore.isValid) {
			isAuthenticated = true;
		}
		organiseResponses();
	});

	$: organiseResponses();
	function organiseResponses() {
		if ($projectsState?.status !== fetchStatus.success) return;
		$projectsState.data.forEach((project) => {
			const projName = project.name;
			const statuses = $workflowState.data.find(
				(workflow) => workflow.id === project.workflow
			)?.statuses;
			statuses.forEach((status) => {
				if (!cardsByStatusByProject[projName]) {
					cardsByStatusByProject[projName] = {};
				}
				cardsByStatusByProject[projName][status.name] = {
					position: status.position,
					isActive: status.is_active,
					cards: [],
					isTerminal: status.is_terminal
				};
			});
		});

		$cardsState.data.forEach((card) => {
			const projName = card.project;
			const statusName = card.status;
			if (cardsByStatusByProject[projName] && cardsByStatusByProject[projName][statusName]) {
				cardsByStatusByProject[projName][statusName].cards.push(card);
			}
		});
	}
</script>

<svelte:head>
	<title>Cards | {site.name}</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	{#if !Object.keys(cardsByStatusByProject).length}
		<ListPlaceholder divClass="w-full" />
	{:else}
		{#each $projectsState.data as project}
			<div class="mb-8">
				<div class="mb-6 text-center">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">
						{project.name}
					</h2>
				</div>
        {#if listView}
				  <CardList canEdit={isAuthenticated} cards={cardsByStatusByProject[project.name]} />
        {:else}
				  <CardListPretty canEdit={isAuthenticated} cards={cardsByStatusByProject[project.name]} />
        {/if}
			</div>
		{/each}
	{/if}
</div>
