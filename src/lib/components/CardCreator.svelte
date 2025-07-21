<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onDestroy } from 'svelte';
	import { createCardState, fetchCreateTagState, fetchStatus } from '$lib/app/stores';
	import { createCard, fetchCreateTags, getCards, resetGetCards } from '$lib/hooks/cards';
  import TagInput from './TagInput.svelte';
  import CategorySelector from './CategorySelector.svelte';
  import StatusSelector from './StatusSelector.svelte';
  import PrioritySelector from './PrioritySelector.svelte';

  const dispatch = createEventDispatcher();

  let title = '';
  let body = '';
  let status = '';
  let priority = 5; // Default to MEDIUM
  let tags: (string | { name: string; id?: string })[] = [];
  let selectedCategory: string | null = null;

  let unsubscribe: () => void;

  // Listen for card creation status
  unsubscribe = createCardState.subscribe(($state) => {
    if ($state.status === 'success') {
      dispatch('close');
    }
  });

  onDestroy(() => {
    unsubscribe && unsubscribe();
  });

  async function submit() {
    tags.length > 0 && await fetchCreateTags('', tags.map(tag => typeof tag === 'object' ? tag.name : tag))
    let tagRecords = []
    if ($fetchCreateTagState.status === fetchStatus.success) {
      tagRecords= $fetchCreateTagState.data
    }
    await createCard({
      title,
      body,
      status,
      priority,
      ...(tagRecords && tagRecords.length > 0 && { tags: tagRecords.map((record: any) => record.id), }),

      category: selectedCategory
    });
    resetGetCards()
    // await getCards('')
  }

  function close() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-primary-100/60 via-white/70 to-secondary-100/60 backdrop-blur-[6px] transition-all duration-300 animate-fade-in" on:click|self={close}>
  <form class="relative bg-white/80 border border-gray-200 shadow-2xl rounded-3xl p-8 min-w-[320px] max-w-[95vw] w-full sm:w-[420px] flex flex-col gap-2 overflow-auto animate-fade-in" on:submit|preventDefault={submit}>
    <div class="">
      <div class="">
        {title?.charAt(0) || '+'}
      </div>
      <h2 class="">Create New Card</h2>
    </div>
    <div class="">
      <label class="" for="title">Title</label>
      <input id="title" type="text" bind:value={title} required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/80 text-lg font-medium" />
    </div>
    <div class="">
      <label class="" for="body">Body</label>
      <textarea id="body" bind:value={body} required rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/80 text-base"></textarea>
    </div>
    <div class="">
      <label class="" for="status">Status</label>
      <StatusSelector bind:selectedStatus={status} />
    </div>
    <div class="">
      <label class="" for="priority">Priority</label>
      <PrioritySelector bind:selectedPriority={priority} />
    </div>
    <div class="">
      <label class="" for="tags">Tags</label>
      <TagInput bind:tags />
    </div>
    <div class="">
      <label class="" for="category">Category</label>
      <CategorySelector bind:selectedCategory />
    </div>
    <div class="">
      <button type="submit" class="">
        <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg>
        Create
      </button>
      <button type="button" class="" on:click={close}>Cancel</button>
    </div>
  </form>
</div>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.35s cubic-bezier(.4,0,.2,1);
}
</style>
