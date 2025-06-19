import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/public';
import { writable } from 'svelte/store';

const HOST = 'https://kroadmapapp.pockethost.io/' ?? env.PUBLIC_POCKETBASE_URL;
export const pb = new PocketBase(HOST);

export const currentUser = writable(pb.authStore);

pb.authStore.onChange((auth) => {
	localStorage.setItem('identifier', pb.authStore.model?.id ?? null);
	currentUser.set(pb.authStore);
});
