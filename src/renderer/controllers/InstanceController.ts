// TODO: Rename all imports from store as AppStore and export namespace
import { ApplicationStore } from "../../universal/store";
import { InstanceSave } from "../../universal/store/InstanceSave";
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
	 *
	 * @param name of instance to launch
	 * @throws if an instance with `name` does not exist
	 * @throws if user is not logged in
	 */
	export function launch(name: string) {
		const instance: InstanceSave | undefined = ApplicationStore.instances.findFromName(name);
		if (instance === undefined)
			throw "An instance with this name does not exist";
		else if (ApplicationStore.auth.get("loggedIn") == false) {
			// TODO: Show warning
			throw "User is not logged in";
		}
		else {
			const opts: Launcher.Option & Launcher.PrecheckService = {
				gamePath: MinecraftSavePath(instance.name),
				resourcePath: MinecraftGamePath,
				version: instance.id,
				javaPath: "java", // TODO: Change to executable path if java is not in %PATH%
				launcherName: "Minecraft Box Launcher",
				// FIXME: update to new api for auth
				// user: ApplicationStore.auth.store as Auth.Response,
				// auth: ApplicationStore.auth.store as Auth.Response
			};
			consoleUtils.debug(`Launching instance ${name} with options: `, opts);
			// spawn game
			const proc = Launcher.launch(opts);
			// update last played
			instance.lastPlayed = new Date().toISOString();
			ApplicationStore.instances.setInstance(instance.name, instance);
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

	/**
	 * Finds an instance and deletes it. Does not uninstall the resolved version
	 * @param oldName name of instance to find
	 * @param newName new name for instance
	 * @throws if instance is not found
	 */
	export function renameInstance(oldName: string, newName: string) {
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

