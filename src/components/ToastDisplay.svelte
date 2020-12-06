<script context="module" lang="ts">
    import { writable } from "svelte/store";
    import { v4 as uuidv4 } from "uuid";

    export enum ToastType {
        Normal,
        Error,
        Success,
    }

    export interface ToastData {
        header: string;
        body: string;
        /**
         * Timeout for toast in ms.
         */
        timeoutMs: number;
        type: ToastType;
    }

    function createVisibleToastsState() {
        const { set, subscribe, update } = writable<
            (ToastData & { id: string })[]
        >([]);

        const removeToast = (id: string) => {
            update((state) => state.filter((toast) => toast.id !== id));
        };

        return {
            set,
            subscribe,
            update,
            /**
             * Add a toast to the display.
             * @param data the `ToastData` to display.
             */
            addToast: (data: ToastData) => {
                const id = uuidv4();
                update((state) => [...state, { ...data, id }]);
                // remove toast after specified timeout
                setTimeout(() => removeToast(id), data.timeoutMs);
            },
            removeToast,
        };
    }

    export const visibleToastsState = createVisibleToastsState();
</script>

<script lang="ts">
    import { fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { cubicInOut } from "svelte/easing";
</script>

<style>
    .toasts-container {
        z-index: 100;
    }

    .toast {
        width: 250px;
    }
</style>

<div class="toasts-container right-0 top-0 fixed">
    {#each $visibleToastsState as toast (toast.id)}
        <div
            transition:fade={{ duration: 200 }}
            animate:flip={{ delay: 200, duration: 400, easing: cubicInOut }}
            on:click={() => visibleToastsState.removeToast(toast.id)}
            class="toast rounded-md cursor-pointer mx-3 my-2 px-3 py-2 {toast.type === ToastType.Normal ? 'bg-white' : toast.type === ToastType.Error ? 'bg-red-500 text-white' : toast.type === ToastType.Success ? 'bg-green-400 text-white' : ''}"
        >
            <p class="text-base font-bold">{toast.header}</p>
            <p class="text-sm">{toast.body}</p>
        </div>
    {/each}
</div>
