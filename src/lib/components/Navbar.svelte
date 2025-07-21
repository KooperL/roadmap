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
	<div class="">
		<NavBrand href="/">
			<span
				class=""
				>name</span
			>
		</NavBrand>
		<NavBrand href="/">
			<span class="">•</span>
		</NavBrand>
	</div>
</Navbar>

<!--Modal bind:open={formModal} size="xs" autoclose={false} class="">
  </Modal -->
