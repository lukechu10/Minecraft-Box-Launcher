import { reduxify } from "svelte-reduxify";
import { writable } from "svelte/store";

export interface InstanceState {}

function createInstanceState() {
    const { set, subscribe, update } = writable({} as InstanceState);

    return {
        set,
        subscribe,
        update,
    };
}

export const instanceState = reduxify(createInstanceState());
