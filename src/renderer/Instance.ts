import { InstanceData } from "./store/InstanceData";
import InstanceStore from "./store/InstanceStore";
import { ApplicationStore } from "./store";

import "./components/InstanceModal"; // add elements to custom elements registry
import * as InstanceModal from "./components/InstanceModal";

import { LaunchOption, Version, ResolvedVersion, launch, MinecraftLocation, MinecraftFolder } from "@xmcl/core";
import { scanLocalJava } from "@xmcl/java-installer";
import { lookupByName } from "@xmcl/user";
import { Authentication } from "@xmcl/user";
import { Installer } from "@xmcl/installer";
import moment from "moment";

import path from "path";
import { remote } from "electron";
import { ChildProcess } from "child_process";
import fs from "fs-extra";
const app = remote.app;

type ModalType = "info";
export default class Instance implements InstanceData {
	public static readonly MINECRAFT_PATH = path.join(app.getPath("userData"), "./game/");
	/**
	 * Returns the path for minecraft saves/logs/configs for a specific instance
	 * @param name name of instance
	 */
	public static readonly MinecraftSavePath = (name: string) => { return path.join(app.getPath("userData"), "./instances/", name); };
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

	public constructor(data: InstanceData) {
		this.name = data.name;
		this.id = data.id;
		this.type = data.type;
		this.clientType = data.clientType;
		this.lastPlayed = data.lastPlayed;
		this.releaseTime = data.releaseTime;
		this.url = data.url;
		this.installed = data.installed;
		this.time = data.time;
	}
	/**
	 * Save this instance to the instance store
	 */
	public syncToStore(): void {
		InstanceStore.modifyInstance(this.name, this);
	}

	public async launch(): Promise<ChildProcess> {
		console.log(`Launching instance "${this.name}" with version "${this.id}".`);
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
			gameProfile: await lookupByName((ApplicationStore.auth.store as Authentication).selectedProfile.name),
			accessToken: (ApplicationStore.auth.store as Authentication).accessToken
		};
		const proc = launch(options);
		this.lastPlayed = new Date().toISOString();
		return proc;
	}
	public async install(): Promise<void> {
		const location: MinecraftLocation = new MinecraftFolder(path.join(app.getPath("userData"), "./game/"));
		console.log(`Starting installation of instance "${this.name}" with version "${this.id}" into dir "${location.root}"`);
		const res = await Installer.install("client", this, location);
		this.installed = true;
		console.log(`Successfully installed instance "${this.name}" with version "${this.id}`);
	}
	/**
	 * Deletes the instance. Note: do not call `syncToStore()` after as the store is automatically updated.
	 * @param deleteFolder deletes the instance folder if value is `true`
	 */
	public async delete(deleteFolder: boolean = false): Promise<void> {
		InstanceStore.deleteInstance(this.name);
		if (deleteFolder) {
			await fs.remove(Instance.MinecraftSavePath(this.name));
		}
	}
	/**
	 * Get time since last played
	 */
	public get lastPlayedStr(): string {
		return this.lastPlayed === "never" ? "never" :
			moment(this.lastPlayed).fromNow();
	}

	public showModal(modal: ModalType): void {
		switch (modal) {
			case "info":
				// InstanceModal.Info.render(this);
				(document.getElementById("modal-info") as InstanceModal.Info).render(this);
				break;
			default:
				throw Error("Not a valid modal");
		}
	}
}
