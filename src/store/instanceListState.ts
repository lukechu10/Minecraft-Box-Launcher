import { reduxify } from "svelte-reduxify";
import { writable } from "svelte/store";
import { Store } from "../util";

export interface InstanceData {
    /**
     * Name of instance
     */
    name: string;
    /**
     * UUID v4 to identify the instance
     */
    uuid: string;
    /**
     * Instance version
     */
    id: string;
    /**
     * Mojang release or snapshot (vanilla only)
     */
    type: string;
    /**
     * Type of client
     */
    clientType: "vanilla" | "forge";
    /**
     * Format: `new Date().toISOString()` or `"never"` if never played
     */
    lastPlayed: string | "never";
    /**
     * Date version was released
     */
    releaseTime: string;
    url: string;
    /**
     * Version binaries are completely installed
     */
    installed: boolean;
    /**
     * True if current instance is being installed
     */
    isInstalling: boolean;
    time: string;
}

export interface InstanceListState {
    instances: InstanceData[];
}

function createInstanceListState() {
    // persist data with electron-store
    // @ts-expect-error
    let store = new Store({
        name: "instances",
        defaults: {
            instances: [],
        },
    });

    const { set, subscribe, update } = writable<InstanceListState>(store.store);

    subscribe((state) => store.set(state));

    const addInstance = (data: InstanceData) => {
        update((state) => ({
            ...state,
            instances: [...state.instances, data],
        }));
    };

    return {
        set,
        subscribe,
        update,
        addInstance,
    };
}

export const instanceListState = reduxify(createInstanceListState());
