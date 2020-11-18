<script lang="ts">
    import { Installer } from "../util";
    import { instanceState } from "../store/instancesState";

    import {
        Button,
        Card,
        CardActions,
        CardText,
        CardTitle,
        Dialog,
    } from "svelte-materialify";

    export let active = false;
    console.log(Installer);
</script>

<Dialog fullscreen bind:active>
    <Card>
        <CardTitle>Create New Instance</CardTitle>
        <CardText>Work in Progress...</CardText>
        <CardActions class="justify-end">
            <Button on:click={() => (active = false)} text>Cancel</Button>
            <Button on:click={() => (active = false)} text class="red-text">
                Save
            </Button>
        </CardActions>
    </Card>
</Dialog>
