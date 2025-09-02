<script lang="ts">
	import { onMount } from 'svelte';
	import { getCard, getCards, getProjectStatus, resetGetCard, updateCard } from '$lib/hooks/cards';
	import { fetchStatus, cardsState, projectStatusState, cardState } from '$lib/app/stores';
	import CardEditor from '$lib/components/CardCreator.svelte';
	import CardView from '$lib/components/CardView.svelte';
	import LandCard from '$lib/components/LandCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	// Statuses will be loaded from projectStatusState
	let showEditor = false;
	let isDragging = false;
	let draggedCardId: string | null = null;
	let draggedFromStatus: string | null = null;
	let hoveredStatus: string | null = null;

	function getCardsByStatus(status: string): any[] {
		return $cardsState.data.filter((card: any) => card.status === status);
	}

	onMount(async () => {
		if ($cardsState.status !== fetchStatus.success) {
			await getCards('');
		}
		if ($projectStatusState.status !== fetchStatus.success) {
			await getProjectStatus('');
		}
	});

	function openCard(cardId: string) {
		getCard(cardId);
	}

	function handleDragStart(event: CustomEvent) {
		isDragging = true;
		console.log(event);
		draggedCardId = event.detail.cardId;
		draggedFromStatus = event.detail.status;
	}

	function handleDragEnd(event: CustomEvent) {
		isDragging = false;
		draggedCardId = null;
		draggedFromStatus = null;
		hoveredStatus = null;
	}

	function handleDragOver(event: DragEvent, status: string) {
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
		hoveredStatus = status;
	}

	function handleDragLeave(event: DragEvent, status: string) {
		// Only clear hover if we're actually leaving the drop zone
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			hoveredStatus = null;
		}
	}

	async function handleDrop(event: DragEvent, targetStatus: string) {
		event.preventDefault();

		const cardId = event.dataTransfer!.getData('text/plain');
		if (!cardId) return;

		const card = $cardsState.data.find((c: any) => c.id === cardId);
		if (card && card.status !== targetStatus) {
			await updateCard(cardId, { ...card, status: targetStatus });

			await getCards('');
		}

		isDragging = false;
		draggedCardId = null;
		draggedFromStatus = null;
		hoveredStatus = null;
	}

	function handleCardOpen(event: CustomEvent) {
		openCard(event.detail.cardId);
	}

	$: sortedStatuses = $projectStatusState.data
		? $projectStatusState.data.sort((a: any, b: any) => a.position - b.position)
		: [];
</script>

<div class="">
	<Button click={() => (showEditor = true)}>
		<PlusOutline class="me-2 h-4 w-4" />
		New Card
	</Button>
	{#if showEditor}
		<CardEditor on:close={() => (showEditor = false)} />
	{/if}
	{#if $cardState.status === fetchStatus.success || $cardState.status === fetchStatus.loading}
		<CardView on:close={resetGetCard} />
	{/if}
	{#if $cardsState.status === fetchStatus.loading || $cardsState.status === fetchStatus.idle}
		<p class="">Loading cards...</p>
	{:else if $cardsState.status === fetchStatus.error}
		<p class="">Error pulling the cards: {$cardsState.errorMessage}</p>
	{:else}
		<div class="mx-4 my-4 flex flex-row gap-2">
			{#if $projectStatusState.status === fetchStatus.loading}
				<p class="">Loading statuses...</p>
			{:else if $projectStatusState.status === fetchStatus.error}
				<p class="">Error loading statuses: {$projectStatusState.errorMessage}</p>
			{:else if $projectStatusState.data}
				{#each sortedStatuses as status}
					<div
						class="flex min-h-[340px] flex-1 flex-col rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-2xl backdrop-blur-md transition-all duration-200 {hoveredStatus ===
							status.name && isDragging
							? 'border-primary-300 bg-primary-50/30 shadow-primary-200/50'
							: ''}"
						on:dragover={(e) => handleDragOver(e, status.name)}
						on:dragleave={(e) => handleDragLeave(e, status.name)}
						on:drop={(e) => handleDrop(e, status.name)}
					>
						<div class="">
							<span class=""></span>
							<h2 class="">{status.name}</h2>
							<span class="">{getCardsByStatus(status.name).length} cards</span>
						</div>
						<div class="">
							{#each getCardsByStatus(status.name) as card (card.card)}
								<LandCard
									{card}
									currentStatus={status.name}
									on:open={handleCardOpen}
									on:dragstart={handleDragStart}
									on:dragend={handleDragEnd}
								/>
							{:else}
								<div class=""><span>Create a card to get started!</span></div>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
