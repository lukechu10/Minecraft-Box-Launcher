<script lang="ts">
    import type { InstanceData } from "../store/instanceListState";
    import InstanceModal from "./InstanceModal.svelte";
    import { fade } from "svelte/transition";

    export let instance: InstanceData;

    let modalActive = false;

    const openInstanceModal = () => (modalActive = true);
</script>

<style>
    .item-inner:hover {
        transform: translateX(4px);
    }
</style>

<div transition:fade={{ duration: 200 }}>
    <div
        on:click={openInstanceModal}
        class="item hover:bg-gray-200 rounded-md cursor-pointer pl-3 py-3 transition-colors"
    >
        <div class="item-inner transition-transform">
            <span class="font-semibold">{instance.name}</span>
            -
            <i>{instance.id}</i>
        </div>
    </div>

    <InstanceModal bind:active={modalActive} {instance} />
</div>
