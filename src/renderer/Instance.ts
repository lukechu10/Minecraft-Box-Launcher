import { launch, LaunchOption, MinecraftFolder, MinecraftLocation, ResolvedVersion, Version } from "@xmcl/core";
import { scanLocalJava } from "@xmcl/installer/java";
import type { Task, TaskRuntime } from "@xmcl/task";
import { lookupByName } from "@xmcl/user";
import type { ChildProcess } from "child_process";
import { remote } from "electron";
import fs from "fs-extra";
import moment from "moment";
import path from "path";
import type TaskProgress from "./components/TaskProgress";
import { ApplicationStore } from "./store";
import AuthStore from "./store/AuthStore";
import { InstanceData, InstanceProcess } from "./store/InstanceData";
import InstanceListStore from "./store/InstanceListStore";
import EventEmitter from "events";

const app = remote.app;

export type ModalType = "options" | "rename" | "saves" | "delete" | "logs";

/**
 * Represents a minecraft launch profile
 * @implements `InstanceData`
 * @extends EventEmitter
 * @event Instance#changed fired when Instance is modified
 */
export class Instance extends EventEmitter implements InstanceData {
	public static readonly MINECRAFT_PATH = path.join(app.getPath("userData"), "./game/");
	public static readonly SAVE_PATH = path.join(app.getPath("userData"), "./instances/");
	/**
	 * Returns the path for minecraft saves/logs/configs for a specific instance
	 */
	public get savePath(): string {
		return path.join(Instance.SAVE_PATH, this.name);
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
	 * Version binaries are completely installed
	 */
	public installed: boolean;
	/**
	 * True if current instance is being installed
	 */
	public isInstalling: boolean;
	/**
	 * Process for running instance
	 */
	public process?: InstanceProcess;
	public time: string;

	public constructor(data: InstanceData) {
		super();
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

	/**
	 * Launches the instance
	 * @fires Instance#changed when lastPlayed is modified
	 */
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
			console.log("Resolved version: ", resolvedVersion);
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

			// make sure save path exists before launching
			await fs.mkdirp(Instance.SAVE_PATH);

			const proc = launch(options);
			this.lastPlayed = new Date().toISOString();
			this.emit("changed");
			return proc;
		}
	}

	/**
	 * Installs the instance
	 * @param dependenciesOnly only downloads version dependencies if true, downloads entire version if false (default)
	 * @fires Instance#changed when installed and isInstalling state is changed
	 */
	public async install(dependenciesOnly = false): Promise<TaskRuntime<Task.State>> {
		const { installTask, installDependenciesTask } = await import(/* webpackChunkName: "installer" */ "./utils/installer");

		const location: MinecraftLocation = MinecraftFolder.from(path.join(app.getPath("userData"), "./game/"));
		console.log(`Starting installation of instance "${this.name}" with version "${this.id}" into dir "${location.root}"`);
		this.isInstalling = true;
		this.emit("changed");

		let task: Task<ResolvedVersion>;
		if (dependenciesOnly)
		// only download dependencies, resolve version
		{
			const resolvedVersion: ResolvedVersion = await Version.parse(location, this.id);
			task = installDependenciesTask(resolvedVersion);
		}
		else {
			task = installTask("client", this, location);
		}
		const taskProgress = document.querySelector<TaskProgress>("task-progress")!;
		const runtime = taskProgress.addInstallTask(task, this.name);

		let rootNode: Task.State;

		return new Promise((resolve, reject) => {
			runtime.on("execute", (node, parentTask) => {
				if (parentTask == undefined)
				// task is root task node
				{
					rootNode = node;
				}
			});

			runtime.on("finish", (res, state) => {
				if (state === rootNode) {
					console.log(`Successfully installed instance "${this.name}" with version "${this.id}`);
					this.installed = true;
					this.isInstalling = false;
					this.emit("changed");
					resolve(runtime);
				}
			});

			runtime.on("fail", err => {
				this.isInstalling = false;
				this.emit("changed");
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
}
