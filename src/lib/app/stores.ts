import { writable } from 'svelte/store';

export interface Metadata {
	title?: string;
	description?: string;
	headline?: string;
}

export interface Toast {
	text?: string;
	icon?: string;
}

export const fetchStatus = {
	idle: 'idle',
	loading: 'loading',
	success: 'success',
	error: 'error'
} as const;

export interface WritableState<T> {
	status: keyof typeof fetchStatus;
	data?: T;
	errorMessage?: string;
}

export const metadata = writable<Metadata>({});
export const toast = writable<Toast>({});

export const projects = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const cards = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const primaryProject = writable<string>('');

