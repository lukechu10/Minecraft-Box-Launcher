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

    <div class="divide-y mt-3 overflow-x-hidden">
        {#each $authState.accounts as account}
            <div>
                <img
                    class="rounded-sm inline-block h-7 w-7"
                    src="https://minotar.net/avatar/{account.selectedProfile.id}"
                    alt="skin head"
                />

                <span>
                    {account?.selectedProfile.name}
                    -
                    <i>{account?.user?.username}</i>
                </span>
            </div>
        {/each}
    </div>
</div>

<LoginModal bind:active={loginModalActive} />
