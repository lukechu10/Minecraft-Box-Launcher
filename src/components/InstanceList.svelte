<script>
    import { flip } from "svelte/animate";
    import { instanceListState } from "../store/instanceListState";
    import InstanceListItem from "./InstanceListItem.svelte";
</script>

{#if $instanceListState.instances.length === 0}
    <p>
        Seems like you haven't created any instances yet. Click the
        <i>Create new Instance</i>
        button above to get started.
    </p>
{/if}

<div class="divide-y mt-3 overflow-x-hidden">
    {#each $instanceListState.instances as instance (instance.uuid)}
        <div animate:flip>
            <InstanceListItem {instance} />
        </div>
    {/each}
</div>
