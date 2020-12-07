<script lang="ts">
    import LoginModal from "../components/LoginModal.svelte";
    import Button from "../components/Button.svelte";
    import { authState } from "../store/authState";

    let loginModalActive = false;
    const openLoginModal = () => (loginModalActive = true);
</script>

<div class="container mt-3 mx-auto">
    <div class="grid grid-flow-row">
        <div class="mt-3">
            <h4 class="inline-block text-2xl font-semibold">Accounts</h4>
            <Button on:click={openLoginModal}>Add new account</Button>
        </div>
    </div>

    {#each $authState.accounts as account}
        <p>{account?.user?.username}</p>
    {/each}
</div>

<LoginModal bind:active={loginModalActive} />
