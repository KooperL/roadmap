<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { newCard } from '../hooks/cards';
  import { cardCreate } from '../app/stores';
  import { onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  let title = '';
  let body = '';
  let status = '';

  let unsubscribe: () => void;

  // Listen for card creation status
  unsubscribe = cardCreate.subscribe(($state) => {
    if ($state.status === 'success') {
      dispatch('close');
    }
  });

  onDestroy(() => {
    unsubscribe && unsubscribe();
  });

  async function submit() {
    await newCard({ title, body, status });
  }

  function close() {
    dispatch('close');
  }
</script>

<div class="editor-backdrop" on:click|self={close}>
  <form class="editor" on:submit|preventDefault={submit}>
    <h2>Create New Card</h2>
    <label>
      Title
      <input type="text" bind:value={title} required />
    </label>
    <label>
      Body
      <textarea bind:value={body} required></textarea>
    </label>
    <label>
      Status
      <input type="text" bind:value={status} required />
    </label>
    <div class="actions">
      <button type="submit">Create</button>
      <button type="button" on:click={close}>Cancel</button>
    </div>
  </form>
</div>

<style>
  .editor-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .editor {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    min-width: 300px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
</style>