<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onDestroy } from 'svelte';
	import { createCardState, fetchStatus } from '$lib/app/stores';
	import { createCard, getCards, resetGetCards } from '$lib/hooks/cards';
	import TagInput from './TagInput.svelte';
	import CategorySelector from './CategorySelector.svelte';
	import StatusSelector from './StatusSelector.svelte';
	import PrioritySelector from './PrioritySelector.svelte';
	import { Input, Textarea } from 'flowbite-svelte';
	import TextArea from './TextArea.svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import Button from './Button.svelte';
	import { cardPriority } from '$lib/config';

	const dispatch = createEventDispatcher();

	let title = '';
	let body = '';
	let status = '';
	let priority = cardPriority.MEDIUM; // Default to MEDIUM
	let tags: (string | { name: string; id?: string })[] = [];
	let selectedCategory: string | null = null;

	let unsubscribe: () => void;

	// Listen for card creation status
	unsubscribe = createCardState.subscribe(($state) => {
		if ($state.status === fetchStatus.success) {
			dispatch('close');
		}
	});

	onDestroy(() => {
		unsubscribe && unsubscribe();
	});
  $: console.log(selectedCategory)
	async function submit() {
		await createCard({
			title,
			body,
			status,
			priority,
			...(tags && tags.length > 0 && { tags: tags.map((record: any) => record.id) }),

			category: selectedCategory
		});
		resetGetCards();
		// await getCards('')
	}

	function close() {
		dispatch('close');
	}
</script>

<div
	class="animate-fade-in fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-primary-100/60 via-white/70 to-secondary-100/60 backdrop-blur-[6px] transition-all duration-300"
	on:click|self={close}
>
	<form
		class="animate-fade-in relative flex w-full min-w-[320px] max-w-[95vw] flex-col gap-2 overflow-auto rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-2xl sm:w-[420px]"
		on:submit|preventDefault={submit}
	>
		<h2 class="">Create New Card</h2>
		<Input
			id="title"
			bind:value={title}
			placeholder="Title..."
			required
			class="text-lg font-medium"
		/>
		<Textarea id="body" bind:value={body} required rows={4} placeholder="Description" class="" />
		<StatusSelector bind:selectedStatus={status} />
		<PrioritySelector bind:selectedPriority={priority} />
		<CategorySelector bind:selectedCategory />
		<div class="">
			<label class="" for="tags">Tags</label>
			<TagInput bind:tags />
		</div>
		<div class="flex justify-between align-middle">
			<Button click={submit} class="">
				<PlusOutline class="me-2 h-4 w-4" />
				Create
			</Button>
			<Button class="" click={close}>Cancel</Button>
		</div>
	</form>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(24px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
