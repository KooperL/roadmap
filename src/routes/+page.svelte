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

<div class="min-h-screen w-full bg-gradient-to-br from-secondary-50 via-white to-primary-100 flex flex-col items-center py-12 px-2">
  <header class="mb-10 text-center">
    <h1 class="text-4xl md:text-5xl font-extrabold text-primary-800 drop-shadow-sm tracking-tight mb-2 flex items-center justify-center gap-3">
      <svg xmlns='http://www.w3.org/2000/svg' class='h-10 w-10 text-primary-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 17v-2a4 4 0 014-4h3m4 4v-2a4 4 0 00-4-4h-3m-4 4v-2a4 4 0 014-4h3m4 4v-2a4 4 0 00-4-4h-3' /></svg>
      Roadmap
    </h1>
    <p class="text-lg text-gray-500 font-medium">Organize your workflow with clarity and style</p>
  </header>

  <button
    class="mb-8 px-8 py-3 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold shadow-2xl hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300 flex items-center gap-2"
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
    <p class="text-gray-500 text-lg mt-8 animate-pulse">Loading cards...</p>
  {:else if $cardsState.status === fetchStatus.error}
    <p class="text-red-600 text-lg mt-8">Error pulling the cards: {$cardsState.errorMessage}</p>
  {:else}
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-8 mt-8">
      {#if $projectStatusState.status === fetchStatus.loading}
        <p class="text-gray-500 text-lg animate-pulse">Loading statuses...</p>
      {:else if $projectStatusState.status === fetchStatus.error}
        <p class="text-red-600 text-lg">Error loading statuses: {$projectStatusState.errorMessage}</p>
      {:else if $projectStatusState.data}
        {#each sortedStatuses as status}
        <div 
          class="flex-1 bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-6 shadow-2xl min-h-[340px] flex flex-col transition-all duration-200 {hoveredStatus === status.name && isDragging ? 'bg-primary-50/30 border-primary-300 shadow-primary-200/50' : ''}"
          on:dragover={(e) => handleDragOver(e, status.name)}
          on:dragleave={(e) => handleDragLeave(e, status.name)}
          on:drop={(e) => handleDrop(e, status.name)}
        >
          <div class="flex items-center gap-2 mb-6">
            <span class="inline-block w-3 h-3 rounded-full bg-primary-400 animate-pulse"></span>
            <h2 class="text-2xl font-bold text-primary-700 tracking-wide">{status.name}</h2>
            <span class="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-secondary-100 text-secondary-700 border border-secondary-200">{getCardsByStatus(status.name).length} cards</span>
          </div>
          <div class="flex flex-col gap-4 flex-1">
            {#each getCardsByStatus(status.name) as card (card.id)}
              <LandCard 
                {card} 
                currentStatus={status.name} 
                on:open={handleCardOpen}
                on:dragstart={handleDragStart}
                on:dragend={handleDragEnd}
              />
            {:else}
              <div class="text-gray-400 italic text-center mt-8">No cards in this column yet. <span class='block text-xs mt-1'>Click "New Card" to get started!</span></div>
            {/each}
          </div>
        </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
