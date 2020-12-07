import type { InstanceData } from "../instanceListState";
import { Version, launch } from "@xmcl/core";
import path from "path";
import { remote } from "electron";

const INSTANCES_PATH = path.join(remote.app.getPath("userData"), "instances");
console.log(INSTANCES_PATH);

export async function launchInstance(instance: InstanceData) {
    console.log("Launching instance", instance);
}
