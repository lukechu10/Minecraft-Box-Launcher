/**
 * All launching logic is in this file
 */

import { ApplicationStore } from "../../universal/store";
import { InstanceSave } from "../../universal/store/InstanceSave";
import { InstanceController } from "./InstanceController";
import * as consoleUtils from "../../universal/consoleUtils";
import path from "path";
import child_process from "child_process";

import { Launcher } from "@xmcl/launch";

import { remote } from "electron";
const app = remote.app;

export namespace LaunchController {
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
				gamePath: InstanceController.MinecraftSavePath(instance.name),
				resourcePath: InstanceController.MinecraftGamePath,
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
}
