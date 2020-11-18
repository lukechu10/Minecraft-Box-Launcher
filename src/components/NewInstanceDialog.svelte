<script lang="ts">
    import { instanceListState } from "../store/instanceListState";
    import { v4 as uuidv4 } from "uuid";

    import {
        Button,
        Card,
        CardActions,
        CardText,
        CardTitle,
        Dialog,
    } from "svelte-materialify";

    export let active = false;

    function saveNewInstance() {
        // close dialog
        active = false;

        instanceListState.addInstance({
            clientType: "vanilla",
            id: "1.8.9",
            installed: false,
            isInstalling: false,
            lastPlayed: "never",
            name: "1.8.9 Test",
            releaseTime: "test",
            time: "test",
            type: "release",
            url: "test",
            uuid: uuidv4(),
        });
    }
</script>

<Dialog fullscreen bind:active>
    <Card>
        <CardTitle>Create New Instance</CardTitle>
        <CardText>Work in Progress...</CardText>
        <CardActions class="justify-end">
            <Button on:click={() => (active = false)} text>Cancel</Button>
            <Button on:click={saveNewInstance} text class="red-text">
                Save
            </Button>
        </CardActions>
    </Card>
</Dialog>
