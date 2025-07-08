<script lang="ts">
  import { onMount } from 'svelte';
  import { getCard, updateCard, deleteCard } from '../hooks/cards';
  import { card, fetchStatus } from '../app/stores';
  import { createEventDispatcher } from 'svelte';

  export let cardId: string;
  const dispatch = createEventDispatcher();

  let editing = false;
  let title = '';
  let body = '';
  let status = '';

  onMount(async () => {
    await getCard(cardId);
  });

  $: if ($card.data && !editing) {
    title = $card.data.title;
    body = $card.data.body;
    status = $card.data.status;
  }

  async function handleSave() {
    await updateCard(cardId, { title, body, status });
    editing = false;
    await getCard(cardId); // Refresh data
    dispatch('updated');
  }

  async function handleDelete() {
    await deleteCard(cardId);
    dispatch('deleted');
  }

  function close() {
    dispatch('close');
  }
</script>

<div class="cardview-backdrop" on:click|self={close}>
  <div class="cardview">
    {#if $card.status === fetchStatus.loading || $card.status === fetchStatus.idle}
      <p>Loading card...</p>
    {:else if $card.status === fetchStatus.error}
      <p>Error loading card: {$card.errorMessage}</p>
    {:else if $card.data}
      {#if editing}
        <input type="text" bind:value={title} style="font-size:1.5em; width:100%;" />
        <div>
          <label>Status:</label>
          <input type="text" bind:value={status} />
        </div>
        <div>
          <label>Body:</label>
          <textarea bind:value={body} rows="5" style="width:100%;"></textarea>
        </div>
        <div class="actions">
          <button on:click={handleSave}>Save</button>
          <button on:click={() => editing = false}>Cancel</button>
          <button on:click={handleDelete} style="color: red;">Delete</button>
          <button on:click={close}>Close</button>
        </div>
      {:else}
        <h2>{title}</h2>
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Body:</strong></div>
        <div>{body}</div>
        <div class="actions">
          <button on:click={() => editing = true}>Edit</button>
          <button on:click={handleDelete} style="color: red;">Delete</button>
          <button on:click={close}>Close</button>
        </div>
      {/if}
    {:else}
      <p>Card not found.</p>
    {/if}
  </div>
</div>

<style>
  .cardview-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .cardview {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    min-width: 300px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
  }
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>