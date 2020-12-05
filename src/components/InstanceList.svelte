<script>
    import { instanceListState } from "../store/instanceListState";
    import InstanceListItem from "./InstanceListItem.svelte";
</script>

<div class="divide-y mt-3">
    {#each $instanceListState.instances as instance (instance.uuid)}
        <InstanceListItem {instance} />
    {/each}
</div>
