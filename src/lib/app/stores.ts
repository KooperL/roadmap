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

// ========================================================================

export const metadata = writable<Metadata>({});
export const toast = writable<Toast>({});

export const projects = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const commentCreateState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const cardsState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const cardState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const updateCardState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const createCardState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const deleteCardState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const fetchCreateTagState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const cardCategoryState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const projectStatusState = writable<WritableState<any>>({
	status: fetchStatus.idle,
	data: undefined,
	errorMessage: undefined
});

export const primaryProject = writable<string>('');
