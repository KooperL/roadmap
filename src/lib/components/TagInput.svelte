<script lang="ts">
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher, onMount } from 'svelte';

	export let tags: (string | { name: string; id?: string })[] = [];

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

<div class="flex">
	{#each tags as tag, idx}
		<span class="flex w-min flex-row items-center" on:click={() => removeTag(idx)}>
			{typeof tag === 'object' ? tag.name : tag}
			<CloseOutline class="me-2 h-4 w-4" />
		</span>
	{/each}
	<input
		bind:this={inputRef}
		bind:value={inputValue}
		class="min-w-[80px] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
		placeholder="Add tag..."
		on:keydown={handleKeydown}
		on:blur={addTagFromInput}
		autocomplete="off"
	/>
</div>

<style>
	input::-webkit-input-placeholder {
		color: #a0aec0;
	}
	input:-ms-input-placeholder {
		color: #a0aec0;
	}
	input::placeholder {
		color: #a0aec0;
	}
</style>
