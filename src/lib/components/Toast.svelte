<script lang="ts">
    import { onMount } from 'svelte';
    import { toastStore, ToastType } from '$lib/app/toast';
    import { ExclamationCircleOutline, FireOutline, CheckCircleOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
    import { Toast as FlowbiteToast } from 'flowbite-svelte';

    let activeToasts: { id: string; timeout: number }[] = [];

    function getIcon(type: ToastType) {
        switch (type) {
            case ToastType.Error:
                return CloseCircleOutline;
            case ToastType.Success:
                return CheckCircleOutline;
            case ToastType.Warning:
                return ExclamationCircleOutline;
            case ToastType.Info:
                return FireOutline;
        }
    }

    function getColor(type: ToastType) {
        switch (type) {
            case ToastType.Error:
                return 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200';
            case ToastType.Success:
                return 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200';
            case ToastType.Warning:
                return 'bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-200';
            case ToastType.Info:
                return 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200';
        }
    }

    $: visibleToasts = $toastStore.slice(0, 3);

    function handleToastDismiss(id: string) {
        toastStore.dismiss(id);
        const index = activeToasts.findIndex(t => t.id === id);
        if (index !== -1) {
            clearTimeout(activeToasts[index].timeout);
            activeToasts.splice(index, 1);
        }
    }

    onMount(() => {
        return () => {
            activeToasts.forEach(t => clearTimeout(t.timeout));
        };
    });
</script>
<div class="">
    {#each visibleToasts as toast (toast.id)}
        <FlowbiteToast class="" color="none">
            <svelte:component
                this={getIcon(toast.type)}
                slot="icon"
                class={`h-5 w-5 rounded ${getColor(toast.type)}`}
            />
            {toast.message}
        </FlowbiteToast>
    {/each}
</div> 