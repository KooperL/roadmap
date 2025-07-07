<script lang="ts">
  import { onMount } from 'svelte';
  import { getCards } from '$lib/hooks/cards';
  import { fetchStatus, cards } from '$lib/app/stores';
	import CardEditor from '$lib/components/CardEditor.svelte';

  const STATUSES = ['TODO', 'IN ACTION', 'DONE'];
  let showEditor = false;

  onMount(async () => {
    if ($cards.status !== fetchStatus.success) {
        await getCards('');
    }
  });
</script>

<h1>Kanban Board</h1>
<button on:click={() => showEditor = true}>New Card</button>
{#if showEditor}
  <CardEditor on:close={() => showEditor = false} />
{/if}
{#if $cards.status === fetchStatus.loading || $cards.status === fetchStatus.idle}
  <p>Loading cards...</p>
{:else if $cards.status === fetchStatus.error}
  <p>Error pulling the cards: {$cards.errorMessage}</p>
{:else}
  <div style="display: flex; gap: 2rem;">
    {#each STATUSES as status}
      <div style="flex: 1; border: 1px solid #ccc; border-radius: 8px; padding: 1rem;">
        <h2>{status}</h2>
        {#each $cards.data.filter(card => card.status === status) as card (card.id)}
          <div style="background: #f9f9f9; margin-bottom: 1rem; padding: 0.5rem; border-radius: 4px;">
            <strong>{card.title}</strong>
            <div>{card.body}</div>
          </div>
        {:else}
          <div style="color: #aaa;">No cards</div>
        {/each}
      </div>
    {/each}
  </div>
{/if}