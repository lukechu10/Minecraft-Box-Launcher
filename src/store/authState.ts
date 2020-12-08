import { reduxify } from "svelte-reduxify";
import { get, writable } from "svelte/store";
import Store from "electron-store";
import type { Authentication } from "@xmcl/user";
import { validate, refresh } from "@xmcl/user";

/**
 * Schema for `authState`.
 */
export interface AuthState {
    accounts: Authentication[];
}

function createAuthState() {
    // persist data with electron-store
    let store = new Store<AuthState>({
        name: "auth",
        defaults: {
            accounts: [],
        },
    });

    const { set, subscribe, update } = writable<AuthState>(store.store);

    subscribe((state) => store.set(state));

    return {
        set,
        subscribe,
        update,
        /**
         * Adds an account to the account list.
         */
        addAccount: (auth: Authentication) =>
            update((state) => {
                state.accounts.push(auth);
                return state;
            }),
        /**
         * Refreshes accounts that are in the account list.
         */
        refreshAllAccounts: async () => {
            let state = get({ subscribe });
            for (let i = 0; i < state.accounts.length; i++) {
                const { accessToken, clientToken } = state.accounts[i];

                const valid = await validate({
                    accessToken,
                    clientToken,
                });
                if (!valid) {
                    try {
                        const newAuth = await refresh({
                            accessToken,
                            clientToken,
                        });

                        console.log(
                            "Refreshing auth. New auth value: ",
                            newAuth
                        );
                        state.accounts[i] = newAuth;
                    } catch (err) {
                        // user needs to login again
                        if (err != "TypeError: Failed to fetch") {
                            // not offline
                            console.error(err);
                        }
                    }
                }
            }
        },
    };
}

export const authState = reduxify(createAuthState());
