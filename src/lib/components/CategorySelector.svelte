<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { cardCategoryState, fetchStatus } from '../app/stores';
  import { getCategories, createCategory } from '../hooks/categories';

  export let selectedCategory: string | null = null;
  const dispatch = createEventDispatcher();

  let showDropdown = false;
  let newCategoryName = '';
  let buttonRef: HTMLButtonElement;

  onMount(async () => {
    await getCategories();
  });

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function selectCategory(categoryId: string) {
    selectedCategory = categoryId;
    showDropdown = false;
    dispatch('change', { category: categoryId });
  }

  async function createNewCategory() {
    if (newCategoryName.trim()) {
      try {
        const newCategory = await createCategory(newCategoryName.trim());
        await getCategories(); // Refresh the list
        selectCategory(newCategory.id);
        newCategoryName = '';
      } catch (error) {
        console.error('Failed to create category:', error);
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showDropdown && newCategoryName.trim()) {
        createNewCategory();
      } else {
        toggleDropdown();
      }
    } else if (e.key === 'Escape') {
      showDropdown = false;
    }
  }

  function getCategoryName(categoryId: string) {
    if (!$cardCategoryState.data) return '';
    const category = $cardCategoryState.data.find((cat: any) => cat.id === categoryId);
    return category?.name || '';
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
    <span class={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
      {selectedCategory ? getCategoryName(selectedCategory) : 'Select category...'}
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" class="" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if showDropdown}
    <div class="">
      {#if $cardCategoryState.status === fetchStatus.loading}
        <div class="">Loading categories...</div>
      {:else if $cardCategoryState.status === fetchStatus.error}
        <div class="">Error loading categories</div>
      {:else if $cardCategoryState.data && $cardCategoryState.data.length > 0}
        {#each $cardCategoryState.data as category}
          <button
            type="button"
            class="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {selectedCategory === category.id ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}"
            on:click={() => selectCategory(category.id)}
          >
            {category.name}
          </button>
        {/each}
      {:else}
        <div class="">No categories available</div>
      {/if}
      
      <div class="">
        <div class="">Create new category:</div>
        <div class="">
          <input
            type="text"
            bind:value={newCategoryName}
            placeholder="Category name..."
            class=""
            on:keydown={handleKeydown}
          />
          <button
            type="button"
            class=""
            on:click={createNewCategory}
            disabled={!newCategoryName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Close dropdown when clicking outside */
  :global(body) {
    position: relative;
  }
</style> 