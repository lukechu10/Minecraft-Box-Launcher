import Store from "electron-store";
import { reduxify } from "svelte-reduxify";
import { writable } from "svelte/store";
import { installInstance } from "./instanceActions/install";
import { launchInstance } from "./instanceActions/launch";

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
     * Currently being launched.
     */
    Launching,
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
     * UUID v4 to identify the instance. Should *NOT* contain `-` character.
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
    processLogs: { type: "stdout" | "stderr"; message: string }[];
}

/**
 * Schema for `instanceListState`.
 */
export interface InstanceListState {
    instances: InstanceData[];
}

/**
 * Filter for `electron-store` serializer backing `instanceListState`.
 */
function instanceListStateStoreFilter(name: string, val: any) {
    // The only valid `state` field when saved to the disk are `InstanceState.CanInstall` and `InstanceState.CanLaunch`.
    if (name === "state") {
        if ([InstanceState.CanInstall, InstanceState.Installing].includes(val))
            return InstanceState.CanInstall;
        else return InstanceState.CanLaunch;
    }
    // Do not serialize processLogs.
    else if (name === "processLogs") return [];
    else return val;
}

function createInstanceListState() {
    // persist data with electron-store
    let store = new Store<InstanceListState>({
        name: "instances",
        defaults: {
            instances: [],
        },
        serialize: (value) =>
            JSON.stringify(value, instanceListStateStoreFilter),
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

    const updateState = (uuid: string, instanceState: InstanceState) =>
        update((state) => {
            for (let instance of state.instances) {
                if (instance.uuid === uuid) {
                    instance.state = instanceState;
                    break;
                }
            }
            return state;
        });

    const addProcessLog = (
        uuid: string,
        message: { type: "stdout" | "stderr"; message: string }
    ) => {
        update((state) => {
            for (let instance of state.instances) {
                if (instance.uuid === uuid) {
                    instance.processLogs.push(message);
                    break;
                }
            }
            return state;
        });
    };

    const resetProcessLog = (uuid: string) =>
        update((state) => {
            for (let instance of state.instances) {
                if (instance.uuid === uuid) {
                    instance.processLogs = [];
                    break;
                }
            }
            return state;
        });

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
        /**
         * Launches an instance using `@xmcl/launch`.
         */
        launchInstance: async (instance: InstanceData) => {
            updateState(instance.uuid, InstanceState.Launching);
            resetProcessLog(instance.uuid);

            const process = await launchInstance(instance);
            updateState(instance.uuid, InstanceState.Launched);

            // reset InstanceState when game exits
            let handledClose: (() => void) | undefined = () => {
                updateState(instance.uuid, InstanceState.CanLaunch);
                handledClose = undefined;
            };

            process
                .on("close", (code) => {
                    console.log(
                        `child process close all stdio with code ${code}`
                    );
                    if (handledClose !== undefined) {
                        handledClose();
                    }
                })
                .on("exit", (code) => {
                    console.log(`child process exited with code ${code}`);
                    if (handledClose !== undefined) {
                        handledClose();
                    }
                });

            // add stdout and stderr to processLogs
            process.stdout?.on("data", (data) => {
                addProcessLog(instance.uuid, {
                    type: "stdout",
                    message: data.toString(),
                });
            });
            process.stderr?.on("data", (data) => {
                addProcessLog(instance.uuid, {
                    type: "stderr",
                    message: data.toString(),
                });
            });
        },
    };
}

export const instanceListState = reduxify(createInstanceListState());
