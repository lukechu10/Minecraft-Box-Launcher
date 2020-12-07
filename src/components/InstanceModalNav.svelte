<script context="module" lang="ts">
    export enum InstanceModalPage {
        QuickActions = "Quick Actions",
        Saves = "Saves",
        Servers = "Servers",
        Mods = "Mods",
        Logs = "Logs",
        Delete = "Delete",
    }
</script>

<script lang="ts">
    export let currentPage: InstanceModalPage = InstanceModalPage.QuickActions;
</script>

<style>
    .selected {
        @apply bg-gray-100 font-semibold;
    }

    .instance-modal-nav {
        width: 110px;
    }
</style>

<div class="instance-modal-nav flex-initial font-light text-right">
    <ul class="mt-2 space-y-1">
        {#each Object.values(InstanceModalPage) as page}
            <li
                class="hover:bg-gray-200 rounded-md cursor-pointer p-1 transition-all"
                class:selected={page === currentPage}
                on:click={() => (currentPage = page)}
            >
                {page}
            </li>
        {/each}
    </ul>
</div>
