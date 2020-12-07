import type { InstanceData } from "../instanceListState";
import { Installer } from "@xmcl/installer";
import path from "path";
import { remote } from "electron";

const VERSIONS_PATH = path.join(remote.app.getPath("userData"), "versions");
console.log(VERSIONS_PATH);

export async function installInstance(instance: InstanceData) {
    await Installer.install("client", instance, VERSIONS_PATH);
}
