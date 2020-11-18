<script lang="ts">
    import { MaterialApp } from "svelte-materialify";
    import { Tabs, Tab, TabContent } from "svelte-materialify";
    import Instances from "./views/Instances.svelte";

    let theme: "light" | "dark" = "light";
</script>

<MaterialApp {theme}>
    <Tabs fixedTabs class="green darken-4 theme--dark">
        <div slot="tabs">
            <Tab>Home</Tab>
            <Tab>Instances</Tab>
            <Tab>Accounts</Tab>
            <Tab>News</Tab>
            <Tab>Settings</Tab>
        </div>
        <TabContent>Home</TabContent>
        <TabContent>
            <Instances />
        </TabContent>
        <TabContent>Accounts</TabContent>
        <TabContent>News</TabContent>
        <TabContent>Settings</TabContent>
    </Tabs>
</MaterialApp>
