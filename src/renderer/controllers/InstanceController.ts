import { ApplicationStore } from "../store";

import path from "path";
import fs from "fs-extra";

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
			return;
		}
	}
	/**
	 * Finds an instance and deletes it. Does not uninstall the resolved version
	 * @param name name of instance
	 * @param deleteFolder if true, deletes the folder connected to the instance
	 * @throws if instance is not found
	 * @throws if error when deleting folder
	 */
	export async function deleteInstance(name: string, deleteFolder: boolean = false): Promise<void> {
		// find instance
		const i = ApplicationStore.instances.findFromName(name);
		if (!i) throw "An instance with this name does not exist";
		else {
			console.log("Removing instance", name);
			ApplicationStore.instances.deleteInstance(name);
			if (deleteFolder) {
				// delete the folder
				await fs.remove(MinecraftSavePath(name));
			}
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
		const i = ApplicationStore.instances.findFromName(oldName);
		if (!i) throw "An instance with this name does not exist";
		else {
			console.log("Renaming instance", name, "to", newName);
			i.name = newName;
			ApplicationStore.instances.setInstance(oldName, i);
			console.log(MinecraftSavePath(oldName), MinecraftSavePath(newName));
			return;
		}
	}
}
