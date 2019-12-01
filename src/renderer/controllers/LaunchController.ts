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
import { MinecraftFolder } from "@xmcl/util";
import { ResolvedVersion, Version } from "@xmcl/version";

import { remote } from "electron";
import { Render } from '../Render';
const app = remote.app;

export namespace LaunchController {
	/**
		 *
		 * @param name of instance to launch
		 * @throws if an instance with `name` does not exist
		 * @throws if user is not logged in
		 */
	export async function launch(name: string): Promise<void> {
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
				version: await Version.parse(InstanceController.MinecraftGamePath, instance.id),
				javaPath: "java", // TODO: Change to executable path if java is not in %PATH%
				launcherName: "Minecraft Box Launcher",
				gameProfile: await ProfileService.lookup((ApplicationStore.auth.store as Auth.Response).selectedProfile.name),
				accessToken: (ApplicationStore.auth.store as Auth.Response).accessToken
			};
			consoleUtils.debug(`Launching instance ${name} with options: `, options);
			// spawn game
			// const proc = Launcher.launch(options);

			try {
				const minecraftFolder = MinecraftFolder.from(options.resourcePath as string);
				await Launcher.ensureLibraries(minecraftFolder, options.version as ResolvedVersion);
				await Launcher.ensureNative(minecraftFolder, options.version as ResolvedVersion, minecraftFolder.getNativesRoot((options.version as ResolvedVersion).id));
			}
			catch (err) {
				// TODO: Show error modal
				Render.corruptedModal({
					name: instance.name, onApprove: () => {
						InstanceController.installByName(instance.name);
						// TODO: add as member to InstanceSave to save text when switching pages
						$(`.btn-play[data-instance-name=${instance.name}]`).text("Installing...").removeClass("green").attr("id", "").addClass(["gray", "disabled"]);
					},
					onDeny: () => { }
				})
				return;
			}
			const args: string[] = await Launcher.generateArguments(options); // get arguments from options
			child_process.spawn(args[0], args.slice(1)); // spawn java instance (args[0] should be "java" or java path from options.javaPath)

			// update last played
			instance.lastPlayed = new Date().toISOString();
			ApplicationStore.instances.setInstance(instance.name, instance);
			return;
		}
	}
}
