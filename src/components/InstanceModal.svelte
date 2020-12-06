<script lang="ts">
    import type { InstanceData } from "src/store/instanceListState";
    import Button from "./Button.svelte";
    import InstanceModalNav, {
        InstanceModalPage,
    } from "./InstanceModalNav.svelte";
    import Modal from "./Modal.svelte";
    import QuickActions from "./InstanceModalPages/QuickActions.svelte";

    export let active = false;
    export let instance: InstanceData;
    const closeInstanceModal = () => (active = false);

    let currentPage: InstanceModalPage;
    let viewComponent = QuickActions;

    $: (async () => {
        switch (currentPage) {
            case InstanceModalPage.QuickActions:
                viewComponent = QuickActions;
                break;
            case InstanceModalPage.Saves:
                viewComponent = (
                    await import("./InstanceModalPages/Saves.svelte")
                ).default;
                break;
            case InstanceModalPage.Servers:
                viewComponent = (
                    await import("./InstanceModalPages/Servers.svelte")
                ).default;
                break;
            case InstanceModalPage.Mods:
                viewComponent = (
                    await import("./InstanceModalPages/Mods.svelte")
                ).default;
                break;
            case InstanceModalPage.Delete:
                viewComponent = (
                    await import("./InstanceModalPages/Delete.svelte")
                ).default;
                break;
        }
    })();

    // Reset page when reopening the modal.
    $: if (active === true) {
        currentPage = InstanceModalPage.QuickActions;
    }
</script>

<Modal bind:active class="max-w-3xl w-11/12">
    <span slot="title">{instance.name}</span>
    <div slot="deny">
        <Button on:click={closeInstanceModal}>Close</Button>
    </div>
    <div slot="accept" />

    <div class="flex divide-x flex-row space-x-2">
        <div>
            <InstanceModalNav bind:currentPage />
            <Button
                class="hover:bg-green-400 bg-green-500 my-3 text-white w-full"
                height="h-7"
            >
                Play
            </Button>
        </div>
        <div class="flex-1 pl-2 pt-2">
            <svelte:component this={viewComponent} {instance} />
        </div>
    </div>
</Modal>
