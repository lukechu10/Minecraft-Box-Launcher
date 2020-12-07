import type { InstanceData } from "../instanceListState";
import { Installer } from "@xmcl/installer";
import path from "path";
import { remote } from "electron";

export const GAME_INSTALL_PATH = path.join(remote.app.getPath("userData"), "game");

export async function installInstance(instance: InstanceData) {
    await Installer.install("client", instance, GAME_INSTALL_PATH);
}
