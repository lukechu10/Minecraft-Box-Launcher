<script lang="ts">
    import NewInstanceDialog from "../components/NewInstanceDialog.svelte";
    import { Button } from "svelte-materialify";

    let newInstanceDialogActive = false;
    const openNewInstanceDialog = () => (newInstanceDialogActive = true);
</script>

<div class="ma-4 d-flex justify-space-between">
    <h4 class="text-h4">Instances</h4>
    <Button depressed on:click={openNewInstanceDialog}>
        Create New Instance
    </Button>
</div>

<NewInstanceDialog bind:active={newInstanceDialogActive} />
