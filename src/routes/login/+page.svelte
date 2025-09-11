<script lang="ts">
	import 'flowbite';
	import '../../app.pcss';
	import { Input, Button } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { logger } from '$lib/logger';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { site } from '$lib/config';

	let email: string;
	let password: string;
	let errorState = false;
	let returnTo = $page.url.searchParams.get('returnTo');

	async function login() {
		const authData = await pb.collection('users').authWithPassword(email, password);
	}

	async function onSubmit(e) {
		try {
			await login();
			window.location.assign(`/`);
		} catch (e) {
			console.error('Error authenticating user', email);
			errorState = true;
		}
	}
</script>
<svelte:head>
	<title>Login | {site.name}</title>
</svelte:head>

<PageLayout title="Login" description="Login to your account to access more features">
	<form on:submit|preventDefault={onSubmit} class="mt-4">
		{#if errorState}
			<p class="text-red-500">Invalid username or password</p>
		{/if}
		<div>
			<label class="block" for="email">email</label>
			<Input
				data-testid="login-email-field"
				id="email"
				type="email"
				bind:value={email}
				placeholder="email"
			/>
		</div>
		<div class="mt-4">
			<label class="block" for="password">Password</label>
			<Input
				data-testid="login-password-field"
				id="password"
				bind:value={password}
				type="password"
				placeholder="Password"
			/>
		</div>
		<div class="mt-4 flex items-center justify-center">
			<Button
				data-testid="login-form-submit"
				class=""
				type="button"
				on:click={(e) => {
					onSubmit(e);
					logger.info('login', 'login form submit');
				}}>Login</Button
			>
		</div>
	</form>
</PageLayout>
