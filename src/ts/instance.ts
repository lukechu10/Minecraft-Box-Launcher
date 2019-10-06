import { instances as InstancesStore } from "./store";

import { Installer } from "@xmcl/installer";
import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";
import { ResolvedVersion } from "@xmcl/version";

import { remote } from "electron";
const app = remote.app;
import * as path from "path";
import InstanceSave from "./instance/InstanceSave";

import jsrender from "jsrender";

/**
 * Folder where are the minecraft versions are saved
 * To-do: add possibility to customize directory
 */
export var MinecraftSavePathBase: string = path.join(app.getPath("userData"), "./instances/");


export function newInstanceModal() {

}

export function newInstance() {

}

/**
 * Returns all instances from instance.json
 */
export function getAllInstances(): InstanceSave[] {
	return InstancesStore.get("instances") as InstanceSave[];
}

/**
 * Renders all instances onto the instance page
 * @param instances list of instances to be rendered (in order)
 */
export function renderInstanceList(instances: InstanceSave[] = getAllInstances()): void {
    if (instances.length == 0) {
        // show no instances availible message
        $("#instance-list").text("You don't have any instances yet. Create one to start playing. 😆");
        return;
    }
	// clear instance list
	$("#instance-list").html("");
	let instanceTemplate = jsrender.templates($("#template-instance").html());
	instances.forEach((instance) => {
		const html: string = instanceTemplate.render(instance);
		$("#instance-list").append(html);
	});
	return;
}

// export var api = require("@xmcl/minecraft-launcher-core");