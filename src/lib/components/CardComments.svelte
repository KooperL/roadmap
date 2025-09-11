<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getCard,
		updateCard,
		deleteCard,
		getCards,
		cardComment,
		resetGetCards
	} from '../hooks/cards';
	import { cardState, fetchStatus } from '../app/stores';
	import { createEventDispatcher } from 'svelte';
	import TagInput from './TagInput.svelte';
	import { cardPriority } from '../config';
	import { Textarea, Input, Heading, P, Button } from 'flowbite-svelte';
	import { ClockSolid, FloppyDiskOutline, PenOutline } from 'flowbite-svelte-icons';
	import moment from 'moment';

	let commentDraft = '';

	async function handleCommentSubmit() {
		const cardId = $cardState.data.id;
		await cardComment(cardId, commentDraft);
		commentDraft = '';
		await getCard(cardId);
	}
	console.log($cardState.data);
</script>

<div class="flex gap-2">
	<Input placeholder="Is there anything you'd like to add?" bind:value={commentDraft} class="" />
	<Button class="" on:click={handleCommentSubmit} disabled={!commentDraft.trim()}>Post</Button>
</div>
<div class="flex flex-col gap-2">
	{#if $cardState.data?.comments?.length}
		{#each $cardState.data.comments as commentObject}
			<div class="">
				<P size="xs" class="text-gray-700 dark:text-gray-500"
					>{commentObject?.expand?.user?.username ?? 'Someone'} - {moment(
						commentObject.created
					).fromNow()}</P
				>
				<P size="">{commentObject.value}</P>
			</div>
		{/each}
	{:else}
		<div class="flex w-full justify-center pt-2 italic text-gray-500">No comments yet.</div>
	{/if}
</div>
