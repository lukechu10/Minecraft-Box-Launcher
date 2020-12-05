<script lang="ts">
    import { scale, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import Button from "./Button.svelte";
    import { createEventDispatcher, onDestroy } from "svelte";

    let klass = "";
    export { klass as class };

    export let active = false;
    export let transitionDuration = 350;

    export let acceptText = "Accept";
    export let denyText = "Deny";

    /// Do not show scroll overflow when modal is open.
    $: if (active)
        document.querySelector("body")!.classList.add("modal-active");
    else document.querySelector("body")!.classList.remove("modal-active");

    const dispatch = createEventDispatcher();
    /**
     * Callback called when modal is accepted. If the handler returns `false`, the modal is not closed automatically.
     */
    export let onAccept: (() => false | void) | undefined = undefined;
    /**
     * Callback called when modal is denied. If the handler returns `false`, the modal is not closed automatically.
     */
    export let onDeny: (() => false | void) | undefined = undefined;

    const accept = () => {
        dispatch("accept");
        if (onAccept === undefined || onAccept() !== false) active = false;
    };
    const deny = () => {
        dispatch("deny");
        if (onDeny === undefined || onDeny() !== false) active = false;
    };

    onDestroy(() => {
        // if active when getting destroyed, close modal.
        if (active) active = false;
    });
</script>

<style>
    .modal {
        transition: opacity 0.25s ease;
    }

    :global(body.modal-active) {
        overflow: hidden;
    }
</style>

{#if active}
    <!-- Modal overlay background -->
    <div
        class="bg-gray-700 bg-opacity-90 h-full left-0 top-0 fixed w-full"
        transition:fade={{ duration: transitionDuration, easing: quintOut }}
    />

    <dialog
        transition:scale={{ duration: transitionDuration, easing: quintOut }}
        class="modal items-center bg-transparent flex h-full left-0 top-0 justify-center mx-auto fixed w-full"
    >
        <div class="modal-container bg-white rounded-md z-50 {klass}">
            <!-- Modal title -->
            <div class="modal-content border-b px-6 py-2 text-left">
                <p class="text-lg font-bold">
                    <slot name="title" />
                </p>
            </div>

            <!-- Modal body -->
            <div class="px-5">
                <slot />
            </div>

            <!-- Modal footer -->
            <div class="border-t flex justify-end mb-2 pr-2 pt-2 space-x-2">
                <slot name="deny">
                    <Button
                        class="hover:bg-red-500 bg-red-700 text-white"
                        on:click={deny}
                    >
                        {denyText}
                    </Button>
                </slot>
                <slot name="accept">
                    <Button
                        class="hover:bg-green-400 bg-green-500 text-white"
                        on:click={accept}
                    >
                        {acceptText}
                    </Button>
                </slot>
            </div>
        </div>
    </dialog>
{/if}
