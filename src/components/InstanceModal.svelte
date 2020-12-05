<script lang="ts">
    import type { InstanceData } from "src/store/instanceListState";

    import Button from "./Button.svelte";
    import InstanceModalNav from "./InstanceModalNav.svelte";
    import Modal from "./Modal.svelte";

    export let active = false;
    export let instance: InstanceData;
    const closeInstanceModal = () => (active = false);
</script>

<Modal bind:active class="w-11/12 max-w-3xl">
    <span slot="title">{instance.name}</span>
    <div slot="deny">
        <Button on:click={closeInstanceModal}>Close</Button>
    </div>
    <div slot="accept" />

    <div class="flex flex-row space-x-2 divide-x">
        <div>
            <InstanceModalNav />
            <Button
                class="bg-green-500 hover:bg-green-400 text-white w-full my-3"
                height="h-7"
            >
                Play
            </Button>
        </div>
        <div class="flex-1">Body</div>
    </div>
</Modal>
