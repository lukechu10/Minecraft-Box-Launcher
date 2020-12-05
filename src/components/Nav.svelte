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
        @apply bg-white text-gray-800 rounded-md;
    }
</style>

<nav class="bg-green-700 flex h-10 top-0 justify-around fixed w-full">
    {#each Object.values(Page) as page}
        <div class="flex-grow text-center p-1">
            <button
                class="transition-all w-full h-full font-semibold text-gray-100"
                class:selected={page === currentPage}
                on:click={() => (currentPage = page)}
            >
                {page}
            </button>
        </div>
    {/each}
</nav>
