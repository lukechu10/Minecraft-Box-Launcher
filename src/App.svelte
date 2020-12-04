<script lang="ts">
    import Nav, { Page } from "./components/Nav.svelte";
    import ToastDisplay from "./components/ToastDisplay.svelte";
    import Home from "./views/Home.svelte";

    let currentPage: Page;
    let viewComponent = Home;
    $: (async () => {
        switch (currentPage) {
            case Page.Home:
                viewComponent = Home;
                break;
            case Page.Instances:
                viewComponent = (await import("./views/Instances.svelte"))
                    .default;
                break;
            case Page.Accounts:
                viewComponent = (await import("./views/Accounts.svelte"))
                    .default;
        }
    })();
</script>

<Nav bind:currentPage />
<main class="mt-10">
    <svelte:component this={viewComponent} />
</main>

<ToastDisplay />
