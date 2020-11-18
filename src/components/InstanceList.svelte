<script>
    import { instanceListState } from "../store/instanceListState";
</script>

<div class="instance-list">
    {#each $instanceListState.instances as instance (instance.uuid)}
        <p>{instance.name}</p>
    {/each}
</div>
