<script lang="ts">
    import type { Installer } from "@xmcl/installer";

    import { v4 as uuidv4 } from "uuid";
    import { instanceListState } from "../store/instanceListState";
    import Modal from "./Modal.svelte";
    import VersionSelector from "./VersionSelector.svelte";

    export let active = false;

    let data: { version?: Installer.Version; name: string } = {
        version: undefined,
        name: "",
    };
    $: console.log(data);

    function saveNewInstance(): false | void {
        instanceListState.addInstance({
            clientType: "vanilla",
            id: data.version.id,
            installed: false,
            isInstalling: false,
            lastPlayed: "never",
            name: data.name,
            releaseTime: data.version.releaseTime,
            time: data.version.time,
            type: data.version.type,
            url: data.version.url,
            uuid: uuidv4(),
        });
    }
</script>

<Modal
    bind:active
    denyText="Cancel"
    acceptText="Create"
    onAccept={saveNewInstance}
>
    <span slot="title">Create new instance</span>
    <!-- New instance form -->
    <div class="my-2 space-y-2">
        <div>
            <label for="instance-name" class="font-semibold">Name:</label>
            <input
                placeholder="Unnamed instance"
                name="instance-name"
                bind:value={data.name}
            />
        </div>
        <div>
            <label for="instance-version" class="font-semibold">Version:</label>
            <VersionSelector bind:version={data.version} />
        </div>
    </div>
</Modal>
