import { instances as InstancesStore, versionsMetaCache } from "./store";
import InstanceSave from "./instance/InstanceSave";

import { Installer } from "@xmcl/installer";
import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";

import { remote, ipcRenderer } from "electron";
const app = remote.app;
import * as path from "path";

import * as Render from "./Render";

// TODO: Replace jsrender with PugJS
import jsrender from "jsrender";
import Window from "./WindowRemote";

/**
 * Folder where are the minecraft versions are saved
 * TODO: add possibility to customize directory
 */
export var MinecraftSavePathBase: string = path.join(app.getPath("userData"), "./instances/");


export function newInstanceModal() {
	ipcRenderer.sendSync("show-window", "newInstance");
}

/**
 *
 * @param version Version of Minecraft to add
 */
export async function newInstance(version: Installer.VersionMeta) {
	// TODO: Add ability to change name in setup
	InstancesStore.addInstance(new InstanceSave(version.id, version));
}

/**
 * Returns all instances from `instance.json`
 * @deprecated Use `InstanceStore.instances` instead
 */
export function getAllInstances(): InstanceSave[] {
	return InstancesStore.get("instances") as InstanceSave[];
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

/**
 * Finds an instance and installs it
 * @param name name of instance
 * @throws if instance is not found
 */
export async function installByName(name: string) {
	// find instance
	const i = InstancesStore.all.find(obj => obj.name === name);
	if (!i) throw "An instance with this name does not exist";
	else {
		console.log(`[DEBUG] Started installation of instance ${i.name} with version ${i.id} and type ${i.clientType}.`);
		await i.install();
		// update instance in store
		InstancesStore.setInstance(i.name, i);
		console.log(`[DEBUG] Installation of ${i.name} finished.`);
		Render.instanceList();
		return;
	}
}

export var api = require("@xmcl/minecraft-launcher-core");