<script lang="ts">
    import { Installer } from "@xmcl/installer";
    let versions = Installer.getVersionList();

    /**
     * Currently selected version.
     */
    export let version: Installer.Version | undefined = undefined;
    (async () => {
        version = (await versions).versions[0];
    })();
</script>

<select
    name="instance-version"
    class="rounded-md px-1 py-1"
    bind:value={version}
>
    {#await versions}
        <option disabled>Loading</option>
    {:then data}
        {#each data.versions as version}
            <option value={version}>{version.id}</option>
        {/each}
    {/await}
</select>
