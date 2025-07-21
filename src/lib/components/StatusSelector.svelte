<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { projectStatusState, fetchStatus } from '../app/stores';
  import { getProjectStatus } from '../hooks/cards';

  export let selectedStatus: string = '';
  const dispatch = createEventDispatcher();

  let showDropdown = false;
  let buttonRef: HTMLButtonElement;

  onMount(async () => {
    await getProjectStatus('');
  });

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function selectStatus(statusName: string) {
    selectedStatus = statusName;
    showDropdown = false;
    dispatch('change', { status: statusName });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      showDropdown = false;
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
    <span class={selectedStatus ? 'text-gray-900' : 'text-gray-500'}>
      {selectedStatus || 'Select status...'}
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" class="" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if showDropdown}
    <div class="">
      {#if $projectStatusState.status === fetchStatus.loading}
        <div class="">Loading statuses...</div>
      {:else if $projectStatusState.status === fetchStatus.error}
        <div class="">Error loading statuses</div>
      {:else if $projectStatusState.data && $projectStatusState.data.length > 0}
        {#each $projectStatusState.data as status}
          <button
            type="button"
            class="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {selectedStatus === status.name ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}"
            on:click={() => selectStatus(status.name)}
          >
            {status.name}
          </button>
        {/each}
      {:else}
        <div class="">No statuses available</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Close dropdown when clicking outside */
  :global(body) {
    position: relative;
  }
</style> 