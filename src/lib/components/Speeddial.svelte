<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import {
		Button,
		Label,
		Input,
		Modal,
		Checkbox,
		Footer,
		FooterCopyright,
		SpeedDial,
		SpeedDialButton,
		FooterLinkGroup,
		Toast,
		FooterLink
	} from 'flowbite-svelte';
	import {
		FireOutline,
		ExclamationCircleOutline,
		UserCircleOutline,
		BugOutline
	} from 'flowbite-svelte-icons';
	import Navbar from '$lib/components/Navbar.svelte';
	import { site } from '$lib/config';
	import { metadata } from '$lib/app/stores';
	import { toast } from '$lib/app/toast';

	let speedDialOpen = false;
	let modalOpen = false;
	$: title = ($metadata.title ? $metadata.title + ' | ' : '') + site.name;
	$: description = site.description;
	$: headline = $metadata.title;
	beforeNavigate(() => {});

	let name = '';
	let email = '';
	let message = '';
	let type = '';

	const submitModalContent = async () => {
		const source = 'test-roadmap';
		await fetch(
			'https://writing-wealth.pockethost.io/api/collections/messages/records?autocancel=false',
			{
				headers: {
					'Content-Type': 'application/json'
				},
				referrer: source,
				body: JSON.stringify({
					name: name,
					email: email,
					message: message,
					source: source,
					type
				}),
				method: 'POST'
			}
		);
		toast.info('Successfully sent')
		modalOpen = false;
	};
</script>

<SpeedDial bind:open={speedDialOpen} defaultClass="fixed end-24 bottom-6" tooltip="none">
	<SpeedDialButton
		on:click={() => {
			speedDialOpen = false;
			type = 'bug';
			modalOpen = true;
		}}
		name="Bug"
	>
		<BugOutline class="h-6 w-6" />
	</SpeedDialButton>
</SpeedDial>

<Modal bind:open={modalOpen} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#" on:submit={submitModalContent}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
			{#if type === 'bug'}
				Found a bug?
			{:else if type === 'feature'}
				Have an idea?
			{/if}
		</h3>
		<Label class="space-y-2">
			{#if type === 'bug'}
				<span>Describe your issue</span>
			{:else if type === 'feature'}
				<span>Describe your idea</span>
			{/if}
			<Input
				type="text"
				name="description"
				bind:value={message}
				placeholder="When I click..."
				required
			/>
		</Label>
		<Button type="submit" class="w-full1">Submit</Button>
	</form>
</Modal>
