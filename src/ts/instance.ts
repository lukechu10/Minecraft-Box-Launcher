import { instances as InstancesStore, versionsMetaCache } from "./store";
import InstanceSave from "./instance/InstanceSave";

import { Installer } from "@xmcl/installer";
import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";

import { remote } from "electron";
const app = remote.app;
import * as path from "path";

import jsrender from "jsrender";

/**
 * Folder where are the minecraft versions are saved
 * TODO: add possibility to customize directory
 */
export var MinecraftSavePathBase: string = path.join(app.getPath("userData"), "./instances/");


export function newInstanceModal() {
	$("#instance-modal").modal("show");
	renderVersionsList();
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
	const i = InstancesStore.instances.find(obj => obj.name === name);
	if (!i) throw "An instance with this name does not exist";
	else {
		console.log(`[DEBUG] Started installation of instance ${i.name} with version ${i.id} and type ${i.clientType}.`)
		await i.install();
		console.log(`[DEBUG] Installation of ${i.name} finished.`)
		return;
	}
}

// TODO: Move declare into new file with rest of templates
declare function instancelistTemplate(data: any): string;
/**
 * Renders all instances onto the instance page
 * @param instances list of instances to be rendered (in order)
 */
export function renderInstanceList(instances: InstanceSave[] = getAllInstances()): void {
	$("#instance-list").html(instancelistTemplate({ data: InstancesStore.instances }));
	$(".ui.dropdown").dropdown();
	return;
}

/**
 * Renders all versions onto the versions modal
 * @param versions list of versions to be rendered (in order)
 */
export function renderVersionsList(versions: Installer.VersionMeta[] = versionsMetaCache.get("versions")): void {
	if (versions.length == 0) {
		// show no instances availible message
		$("#versions-list").text("No versions were found. Wierd. This is probably a problem with Mojang.");
		return;
	}
	// clear instance list
	$("#versions-list").html("");
	let versionTemplate = jsrender.templates($("#template-versionModal").html());
	versions.forEach((version) => {
		const html: string = versionTemplate.render(version);
		$("#versions-list").append(html);
	});
	return;
}

export var api = require("@xmcl/minecraft-launcher-core");