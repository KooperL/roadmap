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
	import TextArea from './TextArea.svelte';
  import { Textarea, Input, Button, Heading } from 'flowbite-svelte'
	import { ClockSolid, FloppyDiskOutline, PenOutline } from 'flowbite-svelte-icons';
	import Chip from './Chip.svelte';
  import moment from 'moment'

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
            {selectedCategory}
          </div>
          <Input type="text" bind:value={title} placeholder="Title" class="" />
        </div>
        <StatusSelector bind:selectedStatus={status} />
        <PrioritySelector bind:selectedPriority={priority} />
        <div class="">
          <!-- <TextArea value={body} rows="5" /> -->
          <Textarea bind:value={body} rows="5" />
        </div>
        <div class="">
          <label class="">Tags:</label>
          <TagInput bind:tags />
        </div>
        <!-- <div class="">
          <label class="">Category:</label>
          <CategorySelector bind:selectedCategory />
        </div> -->
        <div class="flex justify-between align-middle">
          <div>
          <Button on:click={handleSave} color="green">
            <FloppyDiskOutline class="me-2 h-4 w-4" />
            Save
          </Button>
          </div>
          <div>
          <Button on:click={() => editing = false}>Cancel</Button>
          <Button on:click={handleDelete} color="red">Delete</Button>
        </div>
        </div>
      {:else}
        <div class="">
        <div class="flex justify-between">
            {selectedCategory}
            <Chip border>
              <ClockSolid class="text-primary-800 dark:text-primary-400 me-1.5 h-2.5 w-2.5" />
                    {moment($cardState.data.created).fromNow()}
            </Chip>
            {getPriorityName(priority)}
        </div>
        <div class="flex justify-between">
            <Heading tag="h2" class="text-4xl font-extrabold ">{title}</Heading>
            <StatusSelector bind:selectedStatus={status} />
          </div>
        </div>
        <div class=""><span class="">Card Details</span></div>
        <Textarea disabled bind:value={body} />
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
        <div class="flex justify-between align-middle">
          <Button class="" on:click={() => editing = true}>
            <PenOutline class="me-2 h-4 w-4"/>
            Edit
          </Button>
          <Button class="" on:click={close}>Close</Button>
        </div>
        <h3 class="">Comments</h3>
        <div class="flex gap-2">
          <Input
            placeholder="Is there anything you'd like to add?"
            bind:value={commentDraft}
            class=""
          />
          <Button
            class=""
            on:click={handleCommentSubmit}
            disabled={!commentDraft.trim()}
          >
            Post
          </Button>
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
