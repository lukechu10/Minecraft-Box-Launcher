import { InstanceData } from "./store/InstanceData";
import { ApplicationStore } from "./store";
import InstanceListStore from "./store/InstanceListStore";
import AuthStore from "./store/AuthStore";

import "./components/InstanceModal"; // add elements to custom elements registry
import * as InstanceModal from "./components/InstanceModal";

import { LaunchOption, Version, ResolvedVersion, MinecraftLocation, MinecraftFolder, launch } from "@xmcl/core";
import { Installer } from "@xmcl/installer";
import { scanLocalJava } from "@xmcl/installer/java";
import { lookupByName } from "@xmcl/user";
import type { Task, TaskRuntime } from "@xmcl/task";

import moment from "moment";

import path from "path";
import { remote } from "electron";
import type { ChildProcess } from "child_process";
import fs from "fs-extra";
import type TaskProgress from "./components/TaskProgress";
const app = remote.app;

export type ModalType = "options" | "rename" | "saves" | "delete";
export default class Instance implements InstanceData {
	public static readonly MINECRAFT_PATH = path.join(app.getPath("userData"), "./game/");
	/**
	 * Returns the path for minecraft saves/logs/configs for a specific instance
	 */
	public get savePath(): string {
		return path.join(app.getPath("userData"), "./instances/", this.name);
	}
	/**
	 * Name of instance
	 */
	public name: string;
	/**
	 * UUID v4 to identify the instance
	 */
	public uuid: string;
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
	/**
	 * Is instance currently being installed
	 */
	public isInstalling: boolean;
	public time: string;
	[key: string]: any;

	public constructor(data: InstanceData) {
		this.name = data.name;
		this.uuid = data.uuid;
		this.id = data.id;
		this.type = data.type;
		this.clientType = data.clientType;
		this.lastPlayed = data.lastPlayed;
		this.releaseTime = data.releaseTime;
		this.url = data.url;
		this.installed = data.installed;
		this.isInstalling = data.isInstalling;
		this.time = data.time;
	}

	public async launch(): Promise<ChildProcess> {
		console.log(`Launching instance "${this.name}" with version "${this.id}".`);
		if (!AuthStore.store.loggedIn) {
			throw new Error("User not logged in");
		}
		else {
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
				gamePath: this.savePath,
				resourcePath: Instance.MINECRAFT_PATH,
				javaPath,
				version: resolvedVersion,
				minMemory: ApplicationStore.GlobalSettings.store.java.minMemory,
				maxMemory: ApplicationStore.GlobalSettings.store.java.maxMemory,
				gameProfile: await lookupByName(AuthStore.store.selectedProfile.name),
				accessToken: AuthStore.store.accessToken
			};
			const proc = launch(options);
			this.lastPlayed = new Date().toISOString();
			return proc;
		}
	}
	public async install(): Promise<TaskRuntime<Task.State>> {
		return new Promise((resolve, reject) => {
			this.isInstalling = true;
			const location: MinecraftLocation = MinecraftFolder.from(path.join(app.getPath("userData"), "./game/"));
			console.log(`Starting installation of instance "${this.name}" with version "${this.id}" into dir "${location.root}"`);

			const installTask: Task<ResolvedVersion> = Installer.installTask("client", this, location);
			const taskProgress = document.querySelector<TaskProgress>("task-progress")!;
			const runtime = taskProgress.addInstallTask(installTask, this.name);

			runtime.on("finish", (res, state) => {
				if (state.path === "install") {
					this.installed = true;
					this.isInstalling = false;
					console.log(`Successfully installed instance "${this.name}" with version "${this.id}`);
					resolve(runtime);
				}
			});

			runtime.on("fail", err => {
				this.isInstalling = false;
				reject(err);
			});
		});
	}
	/**
	 * Deletes the instance. Note: do not call `syncToStore()` after as the store is automatically updated.
	 * @param deleteFolder deletes the instance folder if value is `true`
	 */
	public async delete(deleteFolder = false): Promise<void> {
		InstanceListStore.deleteInstance(this.name);
		if (deleteFolder) {
			await fs.remove(this.savePath);
		}
		InstanceListStore.syncToStore();
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
			case "options":
				(document.getElementById("modal-options") as InstanceModal.Options).showModal(this);
				break;
			case "rename":
				(document.getElementById("modal-rename") as InstanceModal.Rename).showModal(this);
				break;
			case "saves":
				(document.getElementById("modal-saves") as InstanceModal.Saves).showModal(this);
				break;
			case "delete":
				(document.getElementById("modal-confirmDelete") as InstanceModal.ConfirmDelete).showModal(this);
				break;
			default:
				throw Error("Not a valid modal");
		}
	}
}
