import { writable } from 'svelte/store';

export enum ToastType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error'
}

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
    priority: number;
    duration?: number;
}

const DEFAULT_DURATIONS = {
    [ToastType.Info]: 5000,
    [ToastType.Success]: 3000,
    [ToastType.Warning]: 4000,
    [ToastType.Error]: 6000
};

function createToastStore() {
    const { subscribe, update } = writable<ToastMessage[]>([]);

    return {
        subscribe,
        add: (message: Omit<ToastMessage, 'id'>) => {
            const id = crypto.randomUUID();
            const duration = message.duration ?? DEFAULT_DURATIONS[message.type];
            
            update(messages => {
                const newMessages = [...messages, { ...message, id }];
                return newMessages.sort((a, b) => b.priority - a.priority);
            });

            // Auto-dismiss after duration
            setTimeout(() => {
                update(messages => messages.filter(m => m.id !== id));
            }, duration);
        },
        dismiss: (id: string) => {
            update(messages => messages.filter(m => m.id !== id));
        },
        clear: () => {
            update(() => []);
        }
    };
}

export const toastStore = createToastStore();

// Helper functions for common toast types
export const toast = {
    info: (message: string, priority = 1) => {
        toastStore.add({ type: ToastType.Info, message, priority });
    },
    success: (message: string, priority = 2) => {
        toastStore.add({ type: ToastType.Success, message, priority });
    },
    warning: (message: string, priority = 3) => {
        toastStore.add({ type: ToastType.Warning, message, priority });
    },
    error: (message: string, priority = 10) => {
        toastStore.add({ type: ToastType.Error, message, priority });
    }
}; 