<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { categoryStore, fetchStatus } from '../app/stores';
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
    if (!$categoryStore.data) return '';
    const category = $categoryStore.data.find((cat: any) => cat.id === categoryId);
    return category?.name || '';
  }
</script>

<div class="relative">
  <button
    type="button"
    bind:this={buttonRef}
    on:click={toggleDropdown}
    on:keydown={handleKeydown}
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/80 text-left flex items-center justify-between"
  >
    <span class={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
      {selectedCategory ? getCategoryName(selectedCategory) : 'Select category...'}
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if showDropdown}
    <div class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
      {#if $categoryStore.status === fetchStatus.loading}
        <div class="px-3 py-2 text-gray-500 text-sm">Loading categories...</div>
      {:else if $categoryStore.status === fetchStatus.error}
        <div class="px-3 py-2 text-red-500 text-sm">Error loading categories</div>
      {:else if $categoryStore.data && $categoryStore.data.length > 0}
        {#each $categoryStore.data as category}
          <button
            type="button"
            class="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {selectedCategory === category.id ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}"
            on:click={() => selectCategory(category.id)}
          >
            {category.name}
          </button>
        {/each}
      {:else}
        <div class="px-3 py-2 text-gray-500 text-sm">No categories available</div>
      {/if}
      
      <div class="border-t border-gray-200 p-2">
        <div class="text-xs text-gray-500 mb-1">Create new category:</div>
        <div class="flex gap-1">
          <input
            type="text"
            bind:value={newCategoryName}
            placeholder="Category name..."
            class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-300"
            on:keydown={handleKeydown}
          />
          <button
            type="button"
            class="px-2 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-300"
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