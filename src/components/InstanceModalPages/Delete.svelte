<script lang="ts">
    import type { InstanceData } from "../../store/instanceListState";
    import { instanceListState } from "../../store/instanceListState";
    import Button from "../Button.svelte";
    import { ToastType, visibleToastsState } from "../ToastDisplay.svelte";

    export let instance: InstanceData;

    let nameInput: string = "";
    let isError = false;

    $: isError = nameInput !== "" && nameInput !== instance.name;

    const deleteInstance = () => {
        // NOTE: Modal closing does not need to be handled. The instance should be removed from the DOM and so is the Modal.
        instanceListState.deleteInstance(instance.uuid);

        visibleToastsState.addToast({
            header: "Success",
            body: `Deleted instance ${instance.name}`,
            timeoutMs: 5000,
            type: ToastType.Success,
        });
    };
</script>

<style>
    .error {
        @apply bg-red-200 hover:bg-red-300;
    }
</style>

<p class="text-lg font-semibold">Delete</p>

To confirm that you want to
<i>permanently</i>
delete this instance, type its name (<strong>{instance.name}</strong>) in the
input area below.
<br />
<input
    bind:value={nameInput}
    class:error={isError}
    class="bg-gray-200 hover:bg-gray-300 rounded-md block mt-3 px-3 py-1 transition-colors w-full"
    placeholder={instance.name}
/>
<br />

<Button
    class="hover:bg-red-500 bg-red-700 text-white w-full"
    disabled={nameInput !== instance.name}
    on:click={deleteInstance}
>
    Delete
</Button>
