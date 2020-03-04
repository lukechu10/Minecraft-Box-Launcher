/**
 * All launching logic is in this file
 */

import { ApplicationStore } from "../store";
import { InstanceData } from "../store/InstanceData";
import { InstanceController } from "./InstanceController";
import child_process, { ChildProcess } from "child_process";

import { generateArguments, LaunchOption, MinecraftFolder, LaunchPrecheck, ResolvedVersion, Version } from "@xmcl/core";
import { lookupByName, Authentication } from "@xmcl/user";
import * as JavaInstall from "./JavaInstall";

export namespace LaunchController {
	/**
	 *
	 * @param instance data associated with instance (does not have to be in `InstanceStore`)
	 * @throws if an instance with `name` does not exist
	 * @throws if user is not logged in
	 * @returns a chil process that was spawned or `null` if fail
	 */
	export async function launch(instance: InstanceData): Promise<ChildProcess> {
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
		const options: LaunchOption = {
			gamePath: InstanceController.MinecraftSavePath(instance.name),
			resourcePath: InstanceController.MinecraftGamePath,
			version: await Version.parse(InstanceController.MinecraftGamePath, instance.id),
			javaPath: javaPath,
			minMemory: ApplicationStore.GlobalSettings.store.java.minMemory,
			maxMemory: ApplicationStore.GlobalSettings.store.java.maxMemory,
			launcherName: "Minecraft Box Launcher",
			gameProfile: await lookupByName((ApplicationStore.auth.store as Authentication).selectedProfile.name),
			accessToken: (ApplicationStore.auth.store as Authentication).accessToken
		};
		// spawn game
		// const proc = Launcher.launch(options);

		const minecraftFolder = MinecraftFolder.from(options.resourcePath as string);
		await LaunchPrecheck.checkLibraries(minecraftFolder, options.version as ResolvedVersion, options);
		await LaunchPrecheck.checkNatives(minecraftFolder, options.version as ResolvedVersion, options);

		const args: string[] = await generateArguments(options); // get arguments from options
		const spawnOptions = { cwd: options.gamePath, env: process.env, ...(options.extraExecOption || {}) };
		console.log(`Launching instance ${name} with options: `, options, "and env: ", spawnOptions);
		const spawn = child_process.spawn(args[0], args.slice(1), spawnOptions); // spawn java instance (args[0] should be "java" or java path from options.javaPath)
		return spawn;
	}

}
