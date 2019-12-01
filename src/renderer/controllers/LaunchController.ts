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
import { ProfileService } from "@xmcl/profile-service";
import { Auth } from "@xmcl/auth";

import { remote } from "electron";
const app = remote.app;

export namespace LaunchController {
	/**
		 *
		 * @param name of instance to launch
		 * @throws if an instance with `name` does not exist
		 * @throws if user is not logged in
		 */
	export async function launch(name: string) {
		const instance: InstanceSave | undefined = ApplicationStore.instances.findFromName(name); // get instance data from store
		if (instance === undefined)
			throw "An instance with this name does not exist";
		else if (ApplicationStore.auth.get("loggedIn") == false) {
			// TODO: Show warning
			throw "User is not logged in";
		}
		else {
			
			const options: Launcher.Option & Launcher.PrecheckService = {
				gamePath: InstanceController.MinecraftSavePath(instance.name),
				resourcePath: InstanceController.MinecraftGamePath,
				version: instance.id,
				javaPath: "java", // TODO: Change to executable path if java is not in %PATH%
				launcherName: "Minecraft Box Launcher",
				gameProfile: await ProfileService.lookup((ApplicationStore.auth.store as Auth.Response).selectedProfile.name),
				accessToken: (ApplicationStore.auth.store as Auth.Response).accessToken
			};
			consoleUtils.debug(`Launching instance ${name} with options: `, options);
			// spawn game
			// const proc = Launcher.launch(options);

			// FIXME: check if all assets are availible
			const args: string[] = await Launcher.generateArguments(options); // get arguments from options
			child_process.spawn(args[0], args.slice(1)); // spawn java instance (args[0] should be "java" or java path from options.javaPath)

			// update last played
			instance.lastPlayed = new Date().toISOString();
			ApplicationStore.instances.setInstance(instance.name, instance);
		}
	}
}
