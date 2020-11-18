<script lang="ts">
    import {
        MaterialApp,
        Tab,
        Tabs,
        Window,
        WindowItem,
    } from "svelte-materialify";
    import Accounts from "./views/Accounts.svelte";
    import Home from "./views/Home.svelte";
    import Instances from "./views/Instances.svelte";

    let theme: "light" | "dark" = "light";
    let value = 0;
</script>

<style>
    main {
        height: 100vh;
    }
</style>

<MaterialApp {theme}>
    <main class="d-flex flex-column">
        <nav class="flex-shrink-0">
            <Tabs fixedTabs class="green darken-4 theme--dark" bind:value>
                <div slot="tabs">
                    <Tab>Home</Tab>
                    <Tab>Instances</Tab>
                    <Tab>Accounts</Tab>
                    <Tab>News</Tab>
                    <Tab>Settings</Tab>
                </div>
            </Tabs>
        </nav>
        <Window {value} class="flex-grow-1">
            <WindowItem>
                <Home />
            </WindowItem>
            <WindowItem>
                <Instances />
            </WindowItem>
            <WindowItem>
                <Accounts />
            </WindowItem>
            <WindowItem>News</WindowItem>
            <WindowItem>Settings</WindowItem>
        </Window>
    </main>
</MaterialApp>
