<script lang="ts">
    import {
        instanceListState,
        InstanceState,
    } from "../store/instanceListState";
    import type { InstanceData } from "../store/instanceListState";
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
            case InstanceModalPage.Logs:
                viewComponent = (
                    await import("./InstanceModalPages/Logs.svelte")
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

    const handleInstall = () => {
        instanceListState.installInstance(instance);
    };

    const handleLaunch = () => {
        instanceListState.launchInstance(instance);
    };
</script>

<style>
    .page-container {
        display: block;
        overflow-x: hidden;
        overflow-y: auto;
        overflow-wrap: anywhere;

        height: min(67vh, 500px);
    }
</style>

<Modal bind:active class="max-w-3xl w-11/12">
    <span slot="title">{instance.name}</span>
    <div slot="deny">
        <Button on:click={closeInstanceModal}>Close</Button>
    </div>
    <div slot="accept" />

    <div class="flex divide-x flex-row space-x-2">
        <div>
            <InstanceModalNav bind:currentPage />
            {#if instance.state === InstanceState.CanInstall}
                <Button
                    class="hover:bg-yellow-400 bg-yellow-500 my-3 text-white w-full"
                    height="h-7"
                    on:click={handleInstall}
                >
                    Install
                </Button>
            {:else if instance.state === InstanceState.CanLaunch}
                <Button
                    class="hover:bg-green-400 bg-green-500 my-3 text-white w-full"
                    height="h-7"
                    on:click={handleLaunch}
                >
                    Launch
                </Button>
            {:else if instance.state === InstanceState.Installing}
                <Button disabled class="my-3 text-white w-full" height="h-7">
                    Installing
                </Button>
            {:else if instance.state === InstanceState.Launching}
                <Button disabled class="my-3 text-white w-full" height="h-7">
                    Launching
                </Button>
            {:else if instance.state === InstanceState.Launched}
                <Button disabled class="my-3 text-white w-full" height="h-7">
                    Launched
                </Button>
            {:else if instance.state === InstanceState.Crashed}
                <Button
                    class="hover:bg-red-500 bg-red-700 my-3 text-white w-full"
                    height="h-7"
                >
                    Crashed
                </Button>
            {/if}
        </div>
        <div class="page-container flex-1 pl-2 pt-2 auto">
            <svelte:component this={viewComponent} {instance} />
        </div>
    </div>
</Modal>
