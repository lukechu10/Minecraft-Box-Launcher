import { ApplicationStore } from "../../universal/store";
import { InstanceSave } from "../../universal/store/InstanceSave";
import * as consoleUtils from "../../universal/consoleUtils";
import { Render } from "../Render";

import path from "path";
import child_process from "child_process";

import { Launcher } from "@xmcl/launch";
import { Auth } from "@xmcl/auth";

import { remote } from "electron";
const app = remote.app;

/**
 * All instance related logic
 */
export namespace InstanceController {
	/**
	 * Folder where are the minecraft versions are saved
	 * TODO: add possibility to customize directory
	 */
	export const MinecraftGamePath: string = path.join(app.getPath("userData"), "./game/");
	/**
	 * Returns the path for minecraft saves/logs/configs for a specific instance
	 * @param name name of instance
	 */
	export const MinecraftSavePath = (name: string) => { return path.join(app.getPath("userData"), "./instances/", name); };

	// FIXME: Function not working correctly on windows
	/**
	 * Find where java is installed on local machine
	 */
	export function findJava(): string {
		var spawn = child_process.spawnSync("which", ["java"]).stdout;
		return spawn;
	}
	

	/**
	 * Finds an instance and installs it
	 * @param name name of instance
	 * @throws if instance is not found
	 */
	export async function installByName(name: string): Promise<void> {
		// find instance
		const i = ApplicationStore.instances.findFromName(name);
		if (!i) throw "An instance with this name does not exist";
		else {
			console.log(`[DEBUG] Started installation of instance ${i.name} with version ${i.id} and type ${i.clientType}.`);
			await i.install();
			// update instance in store
			ApplicationStore.instances.setInstance(i.name, i);
			console.log(`[DEBUG] Installation of ${i.name} finished.`);
			Render.instanceList();
			return;
		}
	}
	/**
	 * Finds an instance and deletes it. Does not uninstall the resolved version
	 * @param name name of instance
	 * @throws if instance is not found
	 */
	export function deleteInstance(name: string): void {
		// find instance
		const i = ApplicationStore.instances.findFromName(name);
		if (!i) throw "An instance with this name does not exist";
		else {
			consoleUtils.debug("Removing instance", name);
			ApplicationStore.instances.deleteInstance(name);
			Render.instanceList();
			return;
		}
	}

	/**
	 * Finds an instance and deletes it. Does not uninstall the resolved version
	 * @param oldName name of instance to find
	 * @param newName new name for instance
	 * @throws if instance is not found
	 */
	export function renameInstance(oldName: string, newName: string): void {
		// find instance
		let i = ApplicationStore.instances.findFromName(oldName);
		if (!i) throw "An instance with this name does not exist";
		else {
			consoleUtils.debug("Renaming instance", name, "to", newName);
			i.name = newName;
			ApplicationStore.instances.setInstance(oldName, i);
			Render.instanceList();
			return;
		}
	}
}
