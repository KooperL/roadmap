<script lang="ts">
	import 'flowbite';
	import '../../app.pcss';
	import { Input, Button } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { logger } from '$lib/logger';

	let username: string;
	let password: string;
	let errorState = false;
	let returnTo = $page.url.searchParams.get('returnTo');

	async function login() {
		const authData = await pb.collection('users').authWithPassword(username, password);
	}

	async function onSubmit(e) {
		try {
			await login();
			goto(`/`);
		} catch (e) {
			console.error('Error authenticating user', username);
			errorState = true;
		}
	}
</script>

<div class="rounded px-8 py-6 text-left shadow-lg dark:bg-gray-100">
	<h3 class="text-center text-2xl font-bold">Login to your account</h3>
  <p class="text-center">
		Don't have an account? <a class="text-primary-700" href="/register">Register</a>
	</p>
	<form on:submit|preventDefault class="mt-4">
		{#if errorState}
			<p class="text-red-500">Invalid username or password</p>
		{/if}
		<div>
			<label class="block" for="username">Username</label>
			<Input
				data-testid="login-username-field"
				id="username"
				type="username"
				bind:value={username}
				placeholder="Username"
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
</div>
