<script lang="ts">
	import '../app.pcss';
	import { beforeNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import {
		Button,
		Label,
		Input,
		Modal,
		Checkbox,
		Footer,
		FooterCopyright,
		FooterLinkGroup,
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
	import Speeddial from '$lib/components/Speeddial.svelte';
	import { startHeartbeatCheck, stopHeartbeatCheck } from '$lib/app/heartbeat';
	import Toast from '$lib/components/Toast.svelte';
	import { pb } from '$lib/pocketbase';
	import { logger } from '$lib/logger';

	$: title = ($metadata.title ? $metadata.title + ' | ' : '') + site.name;
	$: description = site.description;
	$: headline = $metadata.title;

	onMount(() => {
		startHeartbeatCheck();
		if (!pb.authStore.isValid) {
			logger.info('layout', 'Clearing auth store');
			pb.authStore.clear();
		}
		return () => stopHeartbeatCheck();
	});

	beforeNavigate(() => {});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="flex h-full flex-col">
	<header>
		<Navbar />
	</header>
	<main class="flex grow">
		<div class="max-h-full w-full">
			<slot />
		</div>
	</main>
	<Footer class="flex justify-center">
		<FooterLinkGroup
			ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
		>
			<FooterLink href="/">Home</FooterLink>
			<FooterLink href="/about">About</FooterLink>
			<FooterLink href="/terms">Terms of Service</FooterLink>
		</FooterLinkGroup>
	</Footer>
</div>
<Toast />
<Speeddial />

<style>
</style>
