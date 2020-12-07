<script lang="ts">
    import Button from "./Button.svelte";

    import Modal from "./Modal.svelte";
    import { ToastType, visibleToastsState } from "./ToastDisplay.svelte";
    import { login } from "@xmcl/user";
    import { authState } from "../store/authState";

    export let active = false;

    const initialData = {
        email: "",
        password: "",
    };
    let data = initialData;

    const handleSubmit = async () => {
        try {
            // Send request to Yggdrasil auth server.
            const auth = await login({
                username: data.email,
                password: data.password,
                requestUser: true,
                clientToken: undefined, // auto generate
            });

            // Auth successful (no exception thrown).
            active = false;

            // Save auth to store.
            authState.addAccount(auth);

            visibleToastsState.addToast({
                header: "Success",
                body: `Logged in as ${
                    auth?.user?.username /* actually email */
                }`,
                timeoutMs: 5000,
                type: ToastType.Success,
            });
            console.log("Successfully logged in", auth);
        } catch (err) {
            if (err.statusCode === 403) {
                visibleToastsState.addToast({
                    header: "Can not login",
                    body:
                        "Invalid username / email or password. Please try again.",
                    timeoutMs: 5000,
                    type: ToastType.Error,
                });
            } else {
                visibleToastsState.addToast({
                    header: "Can not login",
                    body: "Unknown error occurred.",
                    timeoutMs: 5000,
                    type: ToastType.Error,
                });
                console.warn(
                    "An unknown error occurred when trying to log in user",
                    err
                );
            }
        }
    };
</script>

<Modal bind:active class="max-w-3xl w-11/12">
    <span slot="title">Login</span>

    <div slot="deny">
        <Button on:click={() => (active = false)}>Cancel</Button>
    </div>
    <div slot="accept">
        <Button on:click={handleSubmit}>Login</Button>
    </div>

    <!-- Login form -->
    <div class="my-2 space-y-2">
        <div class="flex flex-col">
            <label for="email" class="font-semibold">Username / Email:</label>
            <input
                class="bg-gray-200 hover:bg-gray-300 rounded-md block mt-1 px-3 py-1 transition-colors w-full"
                placeholder="Username / Email"
                name="email"
                bind:value={data.email}
            />
        </div>
        <div class="flex flex-col">
            <label for="password" class="font-semibold">Password:</label>
            <input
                class="bg-gray-200 hover:bg-gray-300 rounded-md border-0 block mt-1 px-3 py-1 focus:ring-0 transition-colors w-full"
                placeholder="Password"
                name="password"
                type="password"
                bind:value={data.password}
            />
        </div>
    </div>
</Modal>
