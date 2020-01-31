/**
 * All launching logic is in this file
 */

import { ApplicationStore } from "../store";
import { InstanceData } from "../store/InstanceData";
import { InstanceController } from "./InstanceController";
import * as consoleUtils from "../../universal/consoleUtils";
import child_process, { ChildProcess } from "child_process";

import { Launcher } from "@xmcl/launch";
import { ProfileService } from "@xmcl/profile-service";
import { Auth } from "@xmcl/auth";
import { MinecraftFolder } from "@xmcl/util";
import { ResolvedVersion, Version } from "@xmcl/version";
import * as JavaInstall from "./JavaInstall";

import * as Render from "../Render";

export namespace LaunchController {
	/**
		 *
		 * @param instance data associated with instance (does not have to be in `InstanceStore`)
		 * @throws if an instance with `name` does not exist
		 * @throws if user is not logged in
		 * @returns a chil process that was spawned or `null` if fail
		 */
	export async function launch(instance: InstanceData): Promise<ChildProcess> {
		if (ApplicationStore.auth.get("loggedIn") == false) {
			// TODO: Show warning
			throw "User is not logged in";
		}
		else {
			let javaPath = ApplicationStore.GlobalSettings.store.java.externalJavaPath;
			// check if using auto detect
			if (javaPath === "") {
				// check if installed
				const info = await JavaInstall.checkInstalled();
				if (info.length === 0) {
					throw new Error("Java installation not detected");
				}
				else {
					javaPath = info[0].path;
				}
			}
			const options: Launcher.Option & Launcher.PrecheckService = {
				gamePath: InstanceController.MinecraftSavePath(instance.name),
				resourcePath: InstanceController.MinecraftGamePath,
				version: await Version.parse(InstanceController.MinecraftGamePath, instance.id),
				javaPath: javaPath,
				minMemory: ApplicationStore.GlobalSettings.store.java.minMemory,
				maxMemory: ApplicationStore.GlobalSettings.store.java.maxMemory,
				launcherName: "Minecraft Box Launcher",
				gameProfile: await ProfileService.lookup((ApplicationStore.auth.store as Auth.Response).selectedProfile.name),
				accessToken: (ApplicationStore.auth.store as Auth.Response).accessToken
			};
			// spawn game
			// const proc = Launcher.launch(options);

			try {
				const minecraftFolder = MinecraftFolder.from(options.resourcePath as string);
				await Launcher.ensureLibraries(minecraftFolder, options.version as ResolvedVersion);
				await Launcher.ensureNative(minecraftFolder, options.version as ResolvedVersion, minecraftFolder.getNativesRoot((options.version as ResolvedVersion).id));
			}
			catch (err) {
				// TODO: Show error modal
				Render.showCorruptedModal({
					name: instance.name, onApprove: () => {
						InstanceController.installByName(instance.name);
						// TODO: add as member to InstanceSave to save text when switching pages
						$(`.btn-play[data-instance-name=${instance.name}]`).text("Installing...").removeClass("green").attr("id", "").addClass(["gray", "disabled"]);
					},
					onDeny: () => { }
				});
				throw err;
			}
			const args: string[] = await Launcher.generateArguments(options); // get arguments from options
			const spawnOptions = { cwd: options.gamePath, env: process.env, ...(options.extraExecOption || {}) };
			consoleUtils.debug(`Launching instance ${name} with options: `, options, "and env: ", spawnOptions);
			const spawn = child_process.spawn(args[0], args.slice(1), spawnOptions); // spawn java instance (args[0] should be "java" or java path from options.javaPath)
			return spawn;
		}
	}
}
