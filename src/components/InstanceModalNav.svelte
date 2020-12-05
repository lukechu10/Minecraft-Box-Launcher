<script context="module" lang="ts">
    export enum InstanceModalPage {
        QuickActions = "Quick Actions",
        Saves = "Saves",
        Servers = "Servers",
        Mods = "Mods",
        Delete = "Delete",
    }
</script>

<script lang="ts">
    export let currentPage: InstanceModalPage = InstanceModalPage.QuickActions;
</script>

<style>
    .selected {
        @apply font-semibold;
    }

    .instance-modal-nav {
        width: 100px;
    }
</style>

<div class="instance-modal-nav flex-initial font-light text-right">
    <ul class="space-y-1">
        {#each Object.values(InstanceModalPage) as page}
            <li
                class="transition-all"
                class:selected={page === currentPage}
                on:click={() => (currentPage = page)}
            >
                {page}
            </li>
        {/each}
    </ul>
</div>
