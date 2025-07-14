<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { updateCard } from '../hooks/cards';

  export let card: any;
  export let currentStatus: string;

  const dispatch = createEventDispatcher();

  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  function handleDragStart(event: DragEvent) {
    if (!event.dataTransfer) return;
    
    isDragging = true;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', card.id);
    
    // Calculate offset from mouse to card element
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    dragOffset.x = event.clientX - rect.left;
    dragOffset.y = event.clientY - rect.top;
    
    // Set drag image with offset
    const dragImage = event.target as HTMLElement;
    if (dragImage) {
      event.dataTransfer.setDragImage(dragImage, dragOffset.x, dragOffset.y);
    }
    
    // Dispatch drag start event
    dispatch('dragstart', { cardId: card.id, status: currentStatus });
  }

  function handleDragEnd() {
    isDragging = false;
    dispatch('dragend', { cardId: card.id });
  }

  function handleClick() {
    if (!isDragging) {
      dispatch('open', { cardId: card.id });
    }
  }
</script>

<div
  class="group bg-white/90 border border-gray-100 rounded-2xl shadow hover:shadow-2xl hover:scale-[1.02] cursor-pointer transition-all duration-200 p-5 flex flex-col gap-2 relative overflow-hidden {isDragging ? 'opacity-50 scale-95' : ''}"
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:click={handleClick}
>
  <div class="flex items-center gap-3 mb-1">
    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center text-primary-700 font-bold text-lg shadow-inner">
      {card.title?.charAt(0) ?? '?'}
    </div>
    <strong class="block text-lg text-primary-800 group-hover:text-primary-900 transition-colors">{card.title}</strong>
  </div>
  <div class="text-gray-700 text-sm line-clamp-3 mb-1">{card.body}</div>
  <div class="flex items-center gap-2 absolute top-3 right-3">
    {#if card.expand?.category}
      <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary-100 text-secondary-700 border border-secondary-200 shadow-sm">
        {card.expand.category.name}
      </span>
    {/if}
    <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200 shadow-sm">{currentStatus}</span>
  </div>
  
  <!-- Drag indicator -->
  <div class="absolute inset-0 bg-primary-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
    <div class="text-primary-600 text-sm font-medium">Drag to move</div>
  </div>
</div> 