// TODO: Rename all imports from store as AppStore and export namespace
import * as AppStore from "../../universal/store";
import InstanceSave from "../instance/InstanceSave";
import * as consoleUtils from "../../universal/consoleUtils";

import path from "path";
import child_process from "child_process";

import { Launcher } from "@xmcl/launch";
import { Auth } from "@xmcl/auth";

import { remote, ipcRenderer } from "electron";
const app = remote.app;

// TODO: Move all logic from ../instance.ts to this file
/**
 * All instance related logic
 */
export namespace InstanceController {
	/**
	 * Folder where are the minecraft versions are saved
	 * TODO: add possibility to customize directory
	 */
	export var MinecraftSavePathBase: string = path.join(app.getPath("userData"), "./instances/");

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
		const instance: InstanceSave | undefined = AppStore.instances.findFromName(name);
		if (instance === undefined) {
			throw "An instance with this name does not exist";
		}
		else {
			const opts: Launcher.Option & Launcher.PrecheckService = {
				gamePath: MinecraftSavePathBase,
				version: instance.id,
				javaPath: "java", // TODO: Change to executable path if java is not in %PATH%
				launcherName: "Minecraft Box Launcher",
				user: AppStore.auth.store as Auth,
				auth: AppStore.auth.store as Auth
			}
			consoleUtils.debug(`Launching instance ${name} with options: `, opts);
			// span game
			const proc = Launcher.launch(opts);
		}
	}
}