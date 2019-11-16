import { instances as InstancesStore, versionsMetaCache } from "../universal/store";
import InstanceSave from "./instance/InstanceSave";

import { Installer } from "@xmcl/installer";
import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";

import { remote, ipcRenderer } from "electron";
const app = remote.app;
import * as path from "path";

import { Render } from "./Render";

// TODO: Replace jsrender with PugJS
import jsrender from "jsrender";

/**
 * Folder where are the minecraft versions are saved
 * TODO: add possibility to customize directory
 */
export var MinecraftSavePathBase: string = path.join(app.getPath("userData"), "./instances/");


export function newInstanceModal() {
	ipcRenderer.sendSync("show-window", "newInstance");
}

/**
 * Sends a request to mojang versions list and saves result in electron store
 * @returns list of all availible vanilla versions or null if error
 */
export async function updateVersionMeta(): Promise<Installer.VersionMeta[] | null> {
	const versionsMeta = await Installer.updateVersionMeta();
	if (!versionsMeta)
		return null;
	else {
		// save to electron store
		versionsMetaCache.set("versions", versionsMeta.versions);
		return versionsMeta.versions;
	}
}

// export var api = require("@xmcl/minecraft-launcher-core");