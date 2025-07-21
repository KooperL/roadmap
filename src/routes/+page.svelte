<script lang="ts">
  import { onMount } from 'svelte';
  import { getCard, getCards, getProjectStatus, resetGetCard } from '$lib/hooks/cards';
  import { fetchStatus, cardsState, projectStatusState, cardState } from '$lib/app/stores';
  import CardEditor from '$lib/components/CardCreator.svelte';
  import CardView from '$lib/components/CardView.svelte';
  import LandCard from '$lib/components/LandCard.svelte';

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
    getCard(cardId)
  }

  function handleDragStart(event: CustomEvent) {
    isDragging = true;
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
      const { updateCard } = await import('$lib/hooks/cards');
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

  $: sortedStatuses = $projectStatusState.data ? $projectStatusState.data.sort((a: any, b: any) => a.position - b.position) : [];
</script>

<div class="">
  <header class="">
    <h1 class="">
      <svg xmlns='http://www.w3.org/2000/svg' class='h-10 w-10 text-primary-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 17v-2a4 4 0 014-4h3m4 4v-2a4 4 0 00-4-4h-3m-4 4v-2a4 4 0 014-4h3m4 4v-2a4 4 0 00-4-4h-3' /></svg>
      Roadmap
    </h1>
    <p class="">Organize your workflow with clarity and style</p>
  </header>

  <button
    class=""
    on:click={() => showEditor = true}
  >
    <svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg>
    New Card
  </button>
  {#if showEditor}
    <CardEditor on:close={() => showEditor = false} />
  {/if}
  {#if $cardState.status === fetchStatus.success || $cardState.status === fetchStatus.loading}
    <CardView on:close={resetGetCard} />
  {/if}
  {#if $cardsState.status === fetchStatus.loading || $cardsState.status === fetchStatus.idle}
    <p class="">Loading cards...</p>
  {:else if $cardsState.status === fetchStatus.error}
    <p class="">Error pulling the cards: {$cardsState.errorMessage}</p>
  {:else}
    <div class="">
      {#if $projectStatusState.status === fetchStatus.loading}
        <p class="">Loading statuses...</p>
      {:else if $projectStatusState.status === fetchStatus.error}
        <p class="">Error loading statuses: {$projectStatusState.errorMessage}</p>
      {:else if $projectStatusState.data}
        {#each sortedStatuses as status}
        <div 
          class="flex-1 bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-6 shadow-2xl min-h-[340px] flex flex-col transition-all duration-200 {hoveredStatus === status.name && isDragging ? 'bg-primary-50/30 border-primary-300 shadow-primary-200/50' : ''}"
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
            {#each getCardsByStatus(status.name) as card (card.id)}
              <LandCard 
                {card} 
                currentStatus={status.name} 
                on:open={handleCardOpen}
                on:dragstart={handleDragStart}
                on:dragend={handleDragEnd}
              />
            {:else}
              <div class="" to get started!</span></div>
            {/each}
          </div>
        </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
