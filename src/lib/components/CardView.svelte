<script lang="ts">
  import { onMount } from 'svelte';
  import { getCard, updateCard, deleteCard, getCards, cardComment, fetchCreateTags, resetGetCards } from '../hooks/cards';
  import { cardState, fetchCreateTagState, fetchStatus } from '../app/stores';
  import { createEventDispatcher } from 'svelte';
  import TagInput from './TagInput.svelte';
  import CategorySelector from './CategorySelector.svelte';
  import StatusSelector from './StatusSelector.svelte';
  import PrioritySelector from './PrioritySelector.svelte';
  import { cardPriority } from '../config';

  let cardId: string;
  const dispatch = createEventDispatcher();

  let editing = false;
  let title = '';
  let body = '';
  let status = '';
  let priority = cardPriority.MEDIUM; // Default to MEDIUM
  let tags: (string | { name: string; id?: string })[] = [];
  let selectedCategory: string | null = null;
  let commentDraft = '';

  onMount(async () => {
    if ($cardState.status === fetchStatus.success) {
      cardId = $cardState!.data!.id
    }
    // await getCard(cardId);
  });

  $: cardId = $cardState?.data?.id ?? ''


  $: if ($cardState.data && !editing) {
    title = $cardState.data.title;
    body = $cardState.data.body;
    status = $cardState.data.status;
    priority = $cardState.data.priority || 5;
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
      ...(priority !== $cardState.data.priority && { priority }),
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
    resetGetCards();
    dispatch('deleted');
  }

  function close() {
    dispatch('close');
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

<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-primary-100/60 via-white/70 to-secondary-100/60 backdrop-blur-[6px] transition-all duration-300" on:click|self={close}>
  <div class="relative bg-white/80 border border-gray-200 shadow-2xl rounded-3xl p-8 min-w-[320px] max-w-[95vw] max-h-[90vh] w-full sm:w-[420px] flex flex-col gap-2 overflow-auto animate-fade-in">
    {#if $cardState.status === fetchStatus.loading || $cardState.status === fetchStatus.idle}
      <p class="">Loading card...</p>
    {:else if $cardState.status === fetchStatus.error}
      <p class="">Error loading card: {$cardState.errorMessage}</p>
    {:else if $cardState.data}
      {#if editing}
        <div class="">
          <div class="">
            {title?.charAt(0) ?? '?'}
          </div>
          <input type="text" bind:value={title} placeholder="Title" class="" />
        </div>
        <div class="">
          <label class="">Status:</label>
          <StatusSelector bind:selectedStatus={status} />
        </div>
        <div class="">
          <label class="">Priority:</label>
          <PrioritySelector bind:selectedPriority={priority} />
        </div>
        <div class="">
          <label class="">Body:</label>
          <textarea bind:value={body} rows="5" class=""></textarea>
        </div>
        <div class="">
          <label class="">Tags:</label>
          <TagInput bind:tags />
        </div>
        <!-- <div class="">
          <label class="">Category:</label>
          <CategorySelector bind:selectedCategory />
        </div> -->
        <div class="">
          <button class="" on:click={handleSave}>
            <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>
            Save
          </button>
          <button class="" on:click={() => editing = false}>Cancel</button>
          <button class="" on:click={handleDelete}>Delete</button>
          <button class="" on:click={close}>Close</button>
        </div>
      {:else}
        <div class="">
          <div class="">
            {title?.charAt(0) ?? '?'}
          </div>
          <h2 class="">{title}</h2>
          <div class="">
            {#if $cardState.data.priority}
              <span class="px-3 py-1 rounded-full text-xs font-semibold border shadow-sm {getPriorityColor($cardState.data.priority)}">
                {getPriorityName($cardState.data.priority)}
              </span>
            {/if}
            <span class="">{status}</span>
          </div>
        </div>
        <div class=""><span class="">Card Details</span></div>
        <div class="">{body}</div>
        <div class="">
          <div class="">
            {#each tags as tag}
              <span class="">{typeof tag === 'object' ? tag.name : tag}</span>
            {/each}
          </div>
        </div>
        {#if $cardState.data?.expand?.category}
          <div class="">
            <div class="">
              <span class="">Category:</span>
              <span class="">
                {$cardState.data.expand.category.name}
              </span>
            </div>
          </div>
        {/if}
        <div class="">
          <button class="" on:click={() => editing = true}>
            <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6l9-9a2.828 2.828 0 10-4-4l-9 9z' /></svg>
            Edit
          </button>
          <button class="" on:click={handleDelete}>Delete</button>
          <button class="" on:click={close}>Close</button>
        </div>
        <h3 class="">Comments</h3>
        <div class="">
          <input
            placeholder="Is there anything you'd like to add?"
            bind:value={commentDraft}
            class=""
          />
          <button
            class=""
            on:click={handleCommentSubmit}
            disabled={!commentDraft.trim()}
          >
            Post
          </button>
        </div>
        <div class="">
          {#if $cardState.data?.expand?.comment_via_card?.length}
            {#each $cardState.data.expand.comment_via_card as commentObject}
              <div class="">
                <div class="">{(new Date(commentObject.created)).toLocaleString()}</div>
                <div class="">{commentObject.body}</div>
              </div>
            {/each}
          {:else}
            <div class="">No comments yet.</div>
          {/if}
        </div>
      {/if}
    {:else}
      <p class="">Card not found.</p>
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
