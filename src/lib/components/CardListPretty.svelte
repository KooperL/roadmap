<script lang="ts">
	import { onMount } from 'svelte';
	import { getCard, getCards, resetGetCard, updateCard } from '$lib/hooks/cards';
	import { fetchStatus, cardsState, cardState, projectsState, workflowState } from '$lib/app/stores';
	import { PlusOutline, EditOutline } from 'flowbite-svelte-icons';
	import { getProjects, getWorkflows } from '$lib/hooks/projects';
	import { ListPlaceholder } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { getPriority } from '$lib/config';

	let isAuthenticated = false;
	
	let cardsByStatusByProject: any = {};
	
	function getVisibleStatusesForProject(projectName: string): [string, any][] {
		const projectStatuses = cardsByStatusByProject[projectName] || {};
		return Object.entries(projectStatuses)
			.sort(([, a], [, b]: [string, any]) => a.position - b.position);
	}
	
	onMount(async () => {
		if ($projectsState.status !== fetchStatus.success) {
			getProjects();
		}

		if ($cardsState.status !== fetchStatus.success) {
			await getCards($projectsState.data?.id);
		}

		if ($workflowState.status !== fetchStatus.success) {
			await getWorkflows();
		}

		if (pb.authStore.isValid) {
			isAuthenticated = true;
		}

		console.log( $workflowState)
		console.log( $projectsState)
		$projectsState.data.forEach(project => {
			const projName = project.name
			const statuses = $workflowState.data.find(workflow => workflow.id === project.workflow)?.statuses
			statuses.forEach(status => {
				if (!cardsByStatusByProject[projName]) {
					cardsByStatusByProject[projName] = {};
				}
				cardsByStatusByProject[projName][status.name] = { position: status.position, isActive: status.is_active , cards: [], isTerminal: status.is_terminal };
			});
		})

		$cardsState.data.forEach(card => {
			const projName = card.project
			const statusName = card.status
			if (cardsByStatusByProject[projName] && cardsByStatusByProject[projName][statusName]) {
				cardsByStatusByProject[projName][statusName].cards.push(card);
			}
		})

		console.log(cardsByStatusByProject);

	});

	function openCard(cardId: string) {
		window.location.assign(`cards?cardId=${cardId}`);
	}

	function editCard(cardId: string) {
		window.location.assign(`update?cardId=${cardId}`);
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	{#if fetchStatus.loading === $cardsState.status || fetchStatus.idle === $cardsState.status || fetchStatus.loading === $projectsState.status || fetchStatus.idle === $projectsState.status}
		<ListPlaceholder divClass="w-full" />
	{:else if $cardsState.status === fetchStatus.error || $projectsState.status === fetchStatus.error}
		<ListPlaceholder divClass="w-full" />
	{:else}
		{#each $projectsState.data as project}
			<div class="mb-8">
				<div class="mb-6 text-center">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">
						{project.name}
					</h2>
				</div>

				<div class="flex gap-4 overflow-x-auto pb-4 justify-center">
					{#each getVisibleStatusesForProject(project.name) as [statusName, statusData]}
						<div class="flex-shrink-0 w-80">
							<div class="bg-gray-100 dark:bg-gray-800 rounded-t-lg px-4 py-3 border-b {
								statusData.isTerminal ? 'border-green-300 dark:border-green-600' : 
								statusData.isActive ? 'border-blue-300 dark:border-blue-600' : 
								'border-gray-300 dark:border-gray-600'
							}">
								<h3 class="font-semibold text-gray-900 dark:text-white {
									statusData.isTerminal ? 'text-green-700 dark:text-green-400' : 
									statusData.isActive ? 'text-blue-700 dark:text-blue-400' : ''
								}">
									{statusName}
									{#if statusData.isTerminal}
										<span class="text-xs ml-1">✓</span>
									{:else if statusData.isActive}
										<span class="text-xs ml-1">⚡</span>
									{/if}
								</h3>
								<span class="text-sm text-gray-500 dark:text-gray-400">
									{statusData.cards.length} cards
								</span>
							</div>

							<div class="bg-gray-50 dark:bg-gray-900 rounded-b-lg h-96 max-h-96 overflow-y-auto p-3 space-y-3 {
								statusData.isTerminal ? 'bg-green-50 dark:bg-green-900/20' : 
								statusData.isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
							}">
								{#each statusData.cards as card}
									<div 
										class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow"
										role="button"
										tabindex="0"
										on:click={() => openCard(card.card)}
										on:keydown={(e) => e.key === 'Enter' && openCard(card.card)}
									>
										<h4 class="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
											{card.title}
										</h4>

										<div class="flex flex-wrap gap-2 mb-3">
											{#if card.category}
												<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
													{card.category}
												</span>
											{/if}

											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {
												getPriority(card.priority)[0] === 'black' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' :
												getPriority(card.priority)[0] === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
												getPriority(card.priority)[0] === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
												'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
											}">
												{getPriority(card.priority)[1]}
											</span>
										</div>

										{#if isAuthenticated}
											<div class="flex justify-end">
												<button
													on:click|stopPropagation={() => editCard(card.card)}
													class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
													title="Edit card"
												>
													<EditOutline class="h-4 w-4 text-gray-500 dark:text-gray-400" />
												</button>
											</div>
										{/if}
									</div>
								{/each}

								{#if statusData.cards.length === 0}
									<div class="text-center py-8">
										<p class="text-gray-500 dark:text-gray-400 text-sm">No cards in {statusName}</p>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
