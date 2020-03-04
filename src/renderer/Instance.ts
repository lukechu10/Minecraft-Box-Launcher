import { InstanceData } from "./store/InstanceData";
import InstanceStore from "./store/InstanceStore";
import { ApplicationStore } from "./store";

import { LaunchOption, Version, ResolvedVersion, launch, MinecraftLocation, MinecraftFolder } from "@xmcl/core";
import { scanLocalJava } from "@xmcl/java-installer";
import { ProfileService } from "@xmcl/profile-service";
import { Auth } from "@xmcl/auth";
import { Installer } from "@xmcl/installer";


import path from "path";
import { remote } from "electron";
import { ChildProcess } from "child_process";
const app = remote.app;

export default class Instance implements InstanceData {
	public static readonly MINECRAFT_PATH = path.join(app.getPath("userData"), "./game/");
	/**
	 * Name of instance
	 */
	public name: string;
	/**
     * Instance version
     */
	public id: string;
	/**
     * Mojang release or snapshot (vanilla only)
     */
	public type: string;
	/**
     * Type of client
     */
	public clientType: "vanilla" | "forge";
	/**
	 * Format: `new Date().toISOString()` or `"never"` if never played
	 */
	public lastPlayed: string | "never";
	/**
	 * Date version was released
	 */
	public releaseTime: string;
	public url: string;
	/**
	 * Version binaires are completely installed
	 */
	public installed: boolean;
	public time: string;
	[key: string]: any;

	/**
	 * Save this instance to the instance store
	 */
	public syncToStore(): void {
		InstanceStore.modifyInstance(this.name, this);
	}

	public async launch(): Promise<ChildProcess> {
		let javaPath: string = ApplicationStore.GlobalSettings.store.java.externalJavaPath;
		// check if using auto detect
		if (javaPath === "") {
			// check if installed
			const info = await scanLocalJava([]);
			if (info.length === 0) throw new Error("Java installation not detected");
			else javaPath = info[0].path;
		}
		const resolvedVersion: ResolvedVersion = await Version.parse(Instance.MINECRAFT_PATH, this.id);
		const options: LaunchOption = {
			gamePath: Instance.MINECRAFT_PATH,
			javaPath,
			version: resolvedVersion,
			minMemory: ApplicationStore.GlobalSettings.store.java.minMemory,
			maxMemory: ApplicationStore.GlobalSettings.store.java.maxMemory,
			gameProfile: await ProfileService.lookup((ApplicationStore.auth.store as Auth.Response).selectedProfile.name),
			accessToken: (ApplicationStore.auth.store as Auth.Response).accessToken
		}
		const proc = launch(options);
		this.lastPlayed = new Date().toISOString();
		return proc;
	}
	public async install(): Promise<void> {
		const location: MinecraftLocation = new MinecraftFolder(path.join(app.getPath("userData"), "./game/"));
		const res = await Installer.install("client", this, location);
		this.installed = true;
	}
	public delete(): void {
		InstanceStore.deleteInstance(this.name);
	}
}