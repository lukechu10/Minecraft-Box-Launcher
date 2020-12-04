<script lang="ts">
    import NewInstanceDialog from "../components/NewInstanceDialog.svelte";
    import InstanceList from "../components/InstanceList.svelte";
    import Button from "../components/Button.svelte";

    let newInstanceDialogActive = false;
    const openNewInstanceDialog = () => (newInstanceDialogActive = true);
</script>

<div class="container mx-auto">
    <div class="grid grid-flow-row">
        <div class="mt-3">
            <h4 class="inline-block">Instances</h4>
            <Button on:click={openNewInstanceDialog}>
                Create new Instance
            </Button>
        </div>
    </div>

    <InstanceList />
</div>

<NewInstanceDialog bind:active={newInstanceDialogActive} />
