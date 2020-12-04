<script context="module" lang="ts">
    export enum Page {
        Home = "Home",
        Instances = "Instances",
        Accounts = "Accounts",
    }
</script>

<script lang="ts">
    export let currentPage: Page = Page.Home;
</script>

<style>
    .selected {
        @apply bg-white border-black border-b-2 text-gray-800;
    }
</style>

<nav class="bg-green-700 flex h-10 top-0 justify-around fixed w-full">
    {#each Object.values(Page) as page}
        <button
            class="flex-grow font-semibold text-gray-100 transition-all"
            class:selected={page === currentPage}
            on:click={() => (currentPage = page)}
        >
            {page}
        </button>
    {/each}
</nav>
