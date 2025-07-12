<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let tags: string[] = [];
  const dispatch = createEventDispatcher();
  let inputValue = '';
  let inputRef: HTMLInputElement;

  function addTagFromInput() {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      tags = [...tags, trimmed];
      dispatch('change', { tags });
    }
    inputValue = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTagFromInput();
    } else if (e.key === 'Backspace' && !inputValue && tags.length) {
      // Remove last tag if input is empty
      tags = tags.slice(0, -1);
      dispatch('change', { tags });
    }
  }

  function removeTag(idx: number) {
    tags = tags.filter((_, i) => i !== idx);
    dispatch('change', { tags });
  }

  // Autofocus input when component mounts
  onMount(() => {
    inputRef && inputRef.focus();
  });
</script>

<div class="flex flex-wrap gap-2 items-center border border-gray-300 rounded-lg px-2 py-1 bg-white/80 focus-within:ring-2 focus-within:ring-primary-300">
  {#each tags as tag, idx}
    <span class="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold cursor-pointer hover:bg-primary-200 transition" on:click={() => removeTag(idx)}>
      {tag?.name ?? tag}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </span>
  {/each}
  <input
    bind:this={inputRef}
    bind:value={inputValue}
    class="flex-1 min-w-[80px] px-1 py-1 bg-transparent outline-none text-sm"
    placeholder="Add tag..."
    on:keydown={handleKeydown}
    on:blur={addTagFromInput}
    autocomplete="off"
  />
</div>

<style>
input::-webkit-input-placeholder { color: #a0aec0; }
input:-ms-input-placeholder { color: #a0aec0; }
input::placeholder { color: #a0aec0; }
</style> 
