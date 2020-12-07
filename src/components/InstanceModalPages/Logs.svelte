<script lang="ts">
    import type { InstanceData } from "src/store/instanceListState";

    export let instance: InstanceData;
</script>

<style>
    .message.stdout {
    }
    .message.stderr {
        @apply text-red-500;
    }
</style>

<p class="text-lg font-semibold">Logs</p>

{#if instance.processLogs.length === 0}
    <p>Launch the game to see the game logs.</p>
{:else}
    <div>
        {#each instance.processLogs as line}
            <p
                class="message font-mono"
                class:stdout={line.type === 'stdout'}
                class:stderr={line.type === 'stderr'}
            >
                {line.message}
            </p>
        {/each}
    </div>
{/if}
