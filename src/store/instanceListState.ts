import { reduxify } from "svelte-reduxify";
import { writable } from "svelte/store";
import Store from "electron-store";
import { installInstance } from "./instanceActions/install";

/**
 * The current state of the instance.
 */
export enum InstanceState {
    /**
     * Default state. Instance is not yet installed.
     */
    CanInstall,
    /**
     * Instance is installed.
     */
    CanLaunch,
    /**
     * Currently being installed.
     */
    Installing,
    /**
     * Currently running.
     */
    Launched,
    /**
     * Running but crashed.
     */
    Crashed,
}

/**
 * Metadata associated with an instance.
 */
export interface InstanceData {
    /**
     * Name of instance.
     */
    name: string;
    /**
     * UUID v4 to identify the instance.
     */
    uuid: string;
    /**
     * Instance version (not to be confused with field `uuid` which is an UUID v4).
     */
    id: string;
    /**
     * Mojang release or snapshot (vanilla only).
     */
    type: string;
    /**
     * Type of client.
     */
    clientType: "vanilla" | "forge";
    /**
     * Format: `new Date().toISOString()` or `"never"` if never played.
     */
    lastPlayed: string | "never";
    /**
     * Date version was released.
     */
    releaseTime: string;
    url: string;
    time: string;
    /**
     * The current state of the instance.
     * @see InstanceState
     */
    state: InstanceState;
}

export interface InstanceListState {
    instances: InstanceData[];
}

function createInstanceListState() {
    // persist data with electron-store
    let store = new Store<InstanceListState>({
        name: "instances",
        defaults: {
            instances: [],
        },
    });

    const { set, subscribe, update } = writable<InstanceListState>(store.store);

    subscribe((state) => store.set(state));

    const addInstance = (data: InstanceData) =>
        update((state) => ({
            ...state,
            instances: [...state.instances, data],
        }));

    const deleteInstance = (uuid: string) =>
        update((state) => ({
            ...state,
            instances: state.instances.filter(
                (instance) => instance.uuid !== uuid
            ),
        }));

    const updateState = (uuid: string, instanceState: InstanceState) => {
        update((state) => {
            for (let instance of state.instances) {
                if (instance.uuid === uuid) {
                    instance.state = instanceState;
                    break;
                }
            }
            return state;
        });
    };

    return {
        set,
        subscribe,
        update,
        /**
         * Adds an new instance to the store with the given `data`.
         */
        addInstance,
        /**
         * Deletes an instance with a given `uuid` from the store.
         */
        deleteInstance,
        /**
         * Updates the `InstanceState` of an instance with a given `uuid`.
         */
        updateState,
        /**
         * Installs an instance using `@xmcl/installer`.
         */
        installInstance: async (instance: InstanceData) => {
            updateState(instance.uuid, InstanceState.Installing);
            await installInstance(instance);
            updateState(instance.uuid, InstanceState.CanLaunch);
        },
    };
}

export const instanceListState = reduxify(createInstanceListState());
