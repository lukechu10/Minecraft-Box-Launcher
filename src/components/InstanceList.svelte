<script>
    import { instanceListState } from "../store/instanceListState";
</script>

<div class="divide-y">
    {#each $instanceListState.instances as instance (instance.uuid)}
        <p>{instance.name} - {instance.id}</p>
    {/each}
</div>
