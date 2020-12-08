import { reduxify } from "svelte-reduxify";
import { writable } from "svelte/store";
import Store from "electron-store";
import type { Authentication } from "@xmcl/user";

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
    };
}

export const authState = reduxify(createAuthState());
