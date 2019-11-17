// TODO: Rename all imports from store as AppStore and export namespace
import { ApplicationStore } from "../../universal/store";
import InstanceSave from "../../universal/store/InstanceSave";
import * as consoleUtils from "../../universal/consoleUtils";
import { Render } from "../Render";

import path from "path";
import child_process from "child_process";

import { Launcher } from "@xmcl/launch";
import { Auth } from "@xmcl/auth";

import { remote, ipcRenderer } from "electron";
const app = remote.app;

/**
 * All instance related logic
 */
export namespace InstanceController {
	/**
	 * Folder where are the minecraft versions are saved
	 * TODO: add possibility to customize directory
	 */
	export const MinecraftSavePathBase: string = path.join(app.getPath("userData"), "./instances/");

	// FIXME: Function not working correctly on windows
	/**
	 * Find where java is installed on local machine
	 */
	export function findJava(): string {
		var spawn = child_process.spawnSync("which", ["java"]).stdout;
		return spawn;
	}
	/**
	 *
	 * @param name of instance to launch
	 * @throws if an instance with `name` does not exist
	 */
	export function launch(name: string) {
		const instance: InstanceSave | undefined = ApplicationStore.instances.findFromName(name);
		if (instance === undefined) {
			throw "An instance with this name does not exist";
		}
		else {
			const opts: Launcher.Option & Launcher.PrecheckService = {
				gamePath: MinecraftSavePathBase,
				version: instance.id,
				javaPath: "java", // TODO: Change to executable path if java is not in %PATH%
				launcherName: "Minecraft Box Launcher",
				user: ApplicationStore.auth.store as Auth,
				auth: ApplicationStore.auth.store as Auth
			};
			consoleUtils.debug(`Launching instance ${name} with options: `, opts);
			// span game
			const proc = Launcher.launch(opts);
		}
	}

	/**
	 * Finds an instance and installs it
	 * @param name name of instance
	 * @throws if instance is not found
	 */
	export async function installByName(name: string) {
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
	export function deleteInstance(name: string) {
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
}