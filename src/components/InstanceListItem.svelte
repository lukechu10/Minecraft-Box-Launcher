<script lang="ts">
    import type { InstanceData } from "../store/instanceListState";
    import InstanceModal from "./InstanceModal.svelte";
    export let instance: InstanceData;

    let modalActive = false;

    const openInstanceModal = () => (modalActive = true);
</script>

<style>
    .item-inner:hover {
        transform: translateX(4px);
    }
</style>

<div>
    <div
        on:click={openInstanceModal}
        class="item py-3 pl-3 hover:bg-gray-200 transition-colors cursor-pointer rounded-md"
    >
        <div class="item-inner transition-transform">
            <span class="font-semibold">{instance.name}</span>
            -
            <i>{instance.id}</i>
        </div>
    </div>

    <InstanceModal bind:active={modalActive} {instance} />
</div>
