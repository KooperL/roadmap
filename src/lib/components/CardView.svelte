<script lang="ts">
  import { onMount } from 'svelte';
  import { getCard, updateCard, deleteCard, getCards, cardComment, fetchCreateTags } from '../hooks/cards';
  import { cardState, fetchCreateTagState, fetchStatus } from '../app/stores';
  import { createEventDispatcher } from 'svelte';
  import TagInput from './TagInput.svelte';
  import CategorySelector from './CategorySelector.svelte';

  export let cardId: string;
  const dispatch = createEventDispatcher();

  let editing = false;
  let title = '';
  let body = '';
  let status = '';
  let tags: (string | { name: string; id?: string })[] = [];
  let selectedCategory: string | null = null;
  let commentDraft = '';

  onMount(async () => {
    await getCard(cardId);
  });

  $: if ($cardState.data && !editing) {
    title = $cardState.data.title;
    body = $cardState.data.body;
    status = $cardState.data.status;
    tags = $cardState.data?.expand?.tags ?? [];
    selectedCategory = $cardState.data.category || null;
  }

  async function handleSave() {
    if (tags.length) await fetchCreateTags('', tags.map(tag => { return typeof tag === 'object' ? tag.name : tag}))
    let desiredTags: any[] = [];
    if ($fetchCreateTagState.status === fetchStatus.success) {
      desiredTags = $fetchCreateTagState.data
    }

    await updateCard(cardId, {
      ...(title !== $cardState.data.title && { title }),
      ...(body !== $cardState.data.body && { body }),
      ...(status !== $cardState.data.status && { status }),
      tags: desiredTags.map((record: any) => record.id),
      ...(selectedCategory !== $cardState.data.category && { category: selectedCategory })
    });
    editing = false;
    await getCard(cardId);
    getCards('');
    dispatch('updated');
  }

  async function handleCommentSubmit() {
    await cardComment(cardId, commentDraft);
    commentDraft = '';
    await getCard(cardId);
  }

  async function handleDelete() {
    await deleteCard(cardId);
    dispatch('deleted');
  }

  function close() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-primary-100/60 via-white/70 to-secondary-100/60 backdrop-blur-[6px] transition-all duration-300" on:click|self={close}>
  <div class="relative bg-white/80 border border-gray-200 shadow-2xl rounded-3xl p-8 min-w-[320px] max-w-[95vw] max-h-[90vh] w-full sm:w-[420px] flex flex-col gap-2 overflow-auto animate-fade-in">
    {#if $cardState.status === fetchStatus.loading || $cardState.status === fetchStatus.idle}
      <p class="text-gray-500 text-lg animate-pulse">Loading card...</p>
    {:else if $cardState.status === fetchStatus.error}
      <p class="text-red-600 text-lg">Error loading card: {$cardState.errorMessage}</p>
    {:else if $cardState.data}
      {#if editing}
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center text-primary-700 font-bold text-2xl shadow-inner">
            {title?.charAt(0) ?? '?'}
          </div>
          <input type="text" bind:value={title} placeholder="Title" class="text-2xl font-bold w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 bg-white/80" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-semibold mb-1">Status:</label>
          <input type="text" bind:value={status} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 bg-white/80" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-semibold mb-1">Body:</label>
          <textarea bind:value={body} rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 bg-white/80"></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-semibold mb-1">Tags:</label>
          <TagInput bind:tags />
        </div>
        <!-- <div class="mb-4">
          <label class="block text-sm font-semibold mb-1">Category:</label>
          <CategorySelector bind:selectedCategory />
        </div> -->
        <div class="flex gap-3 mt-8 border-t border-gray-100 pt-6">
          <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold shadow hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400" on:click={handleSave}>
            <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>
            Save
          </button>
          <button class="px-4 py-2 rounded-lg bg-secondary-100 text-secondary-800 font-semibold shadow hover:bg-secondary-200 transition-colors focus:outline-none" on:click={() => editing = false}>Cancel</button>
          <button class="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition-colors focus:outline-none" on:click={handleDelete}>Delete</button>
          <button class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition-colors focus:outline-none" on:click={close}>Close</button>
        </div>
      {:else}
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center text-primary-700 font-bold text-2xl shadow-inner">
            {title?.charAt(0) ?? '?'}
          </div>
          <h2 class="text-2xl font-bold text-primary-800 flex-1">{title}</h2>
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200 shadow-sm">{status}</span>
        </div>
        <div class="mb-2 border-b border-gray-100 pb-2"><span class="text-xs text-gray-400">Card Details</span></div>
        <div class="mb-4 whitespace-pre-line text-gray-700 text-base leading-relaxed">{body}</div>
        <div class="mb-4">
          <div class="flex flex-wrap gap-2">
            {#each tags as tag}
              <span class="px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-200 shadow-sm cursor-default">{typeof tag === 'object' ? tag.name : tag}</span>
            {/each}
          </div>
        </div>
        {#if $cardState.data?.expand?.category}
          <div class="mb-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">Category:</span>
              <span class="px-2 py-1 rounded-full bg-secondary-100 text-secondary-700 text-xs font-semibold border border-secondary-200 shadow-sm">
                {$cardState.data.expand.category.name}
              </span>
            </div>
          </div>
        {/if}
        <div class="flex gap-3 mt-8 border-t border-gray-100 pt-6">
          <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-secondary-600 to-primary-500 text-white font-semibold shadow hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-400" on:click={() => editing = true}>
            <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6l9-9a2.828 2.828 0 10-4-4l-9 9z' /></svg>
            Edit
          </button>
          <button class="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition-colors focus:outline-none" on:click={handleDelete}>Delete</button>
          <button class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition-colors focus:outline-none" on:click={close}>Close</button>
        </div>
        <h3 class="mt-10 mb-2 text-lg font-semibold text-primary-800">Comments</h3>
        <div class="mb-4 flex items-center gap-2">
          <input
            placeholder="Is there anything you'd like to add?"
            bind:value={commentDraft}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 bg-white/80 text-sm"
          />
          <button
            class="px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold shadow hover:bg-primary-600 transition-colors focus:outline-none"
            on:click={handleCommentSubmit}
            disabled={!commentDraft.trim()}
          >
            Post
          </button>
        </div>
        <div class="flex flex-col gap-3">
          {#if $cardState.data?.expand?.comment_via_card?.length}
            {#each $cardState.data.expand.comment_via_card as commentObject}
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div class="text-xs text-gray-400 mb-1">{(new Date(commentObject.created)).toLocaleString()}</div>
                <div class="text-gray-700 text-sm whitespace-pre-line">{commentObject.body}</div>
              </div>
            {/each}
          {:else}
            <div class="text-gray-400 italic text-sm">No comments yet.</div>
          {/if}
        </div>
      {/if}
    {:else}
      <p class="text-gray-400 italic">Card not found.</p>
    {/if}
  </div>
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
