<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
		Modal,
		Label,
		Input,
		DarkMode,
		Checkbox
	} from 'flowbite-svelte';
	import { UserCircleOutline } from 'flowbite-svelte-icons';
	import { pb, currentUser } from '../pocketbase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { site } from '$lib/config';
	import { fetchStatus, cardsState } from '$lib/app/stores';
	import { onMount } from 'svelte';
	import { getCards } from '$lib/hooks/cards';
	let formModal = true;

	onMount(async () => {
		if ($cardsState.status !== fetchStatus.success) {
			await getCards('-1');
		}
	});
</script>

<Navbar>
	<div class="flex flex-wrap gap-4">
		<NavBrand href="/">
			<span
				class="self-center whitespace-nowrap pr-2 text-8xl text-xl font-bold font-semibold text-primary-700 dark:text-white"
				>name</span
			>
		</NavBrand>
		<NavBrand href="/">
			<span class="hidden self-center whitespace-nowrap sm:block dark:text-white">•</span>
		</NavBrand>
	</div>
</Navbar>

<!--Modal bind:open={formModal} size="xs" autoclose={false} class="w-full bg-gray-100 absolute">
  </Modal -->
