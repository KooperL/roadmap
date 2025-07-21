<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cardPriority } from '../config';

  export let selectedPriority: number = cardPriority.MEDIUM;
  const dispatch = createEventDispatcher();

  let showDropdown = false;
  let buttonRef: HTMLButtonElement;

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function selectPriority(priorityValue: number) {
    selectedPriority = priorityValue;
    showDropdown = false;
    dispatch('change', { priority: priorityValue });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      showDropdown = false;
    }
  }

  function getPriorityName(priorityValue: number): string {
    const entries = Object.entries(cardPriority);
    const entry = entries.find(([key, value]) => value === priorityValue);
    return entry ? entry[0] : 'MEDIUM';
  }

  function getPriorityColor(priorityValue: number): string {
    switch (priorityValue) {
      case cardPriority.CRITICAL:
        return 'text-red-700 bg-red-100 border-red-200';
      case cardPriority.HIGH:
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case cardPriority.MEDIUM:
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case cardPriority.LOW:
        return 'text-green-700 bg-green-100 border-green-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  }
</script>

<div class="">
  <button
    type="button"
    bind:this={buttonRef}
    on:click={toggleDropdown}
    on:keydown={handleKeydown}
    class=""
  >
    <span class="">
      <span class={getPriorityColor(selectedPriority) + " px-2 py-1 rounded-full text-xs font-semibold border"}>
        {getPriorityName(selectedPriority)}
      </span>
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" class="" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if showDropdown}
    <div class="">
      {#each Object.entries(cardPriority) as [priorityName, priorityValue]}
        <button
          type="button"
          class="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between {selectedPriority === priorityValue ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}"
          on:click={() => selectPriority(priorityValue)}
        >
          <span class={getPriorityColor(priorityValue) + " px-2 py-1 rounded-full text-xs font-semibold border"}>
            {priorityName}
          </span>
          {#if selectedPriority === priorityValue}
            <svg xmlns="http://www.w3.org/2000/svg" class="" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Close dropdown when clicking outside */
  :global(body) {
    position: relative;
  }
</style> 