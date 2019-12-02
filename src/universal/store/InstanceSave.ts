import path from "path";

import { Installer } from "@xmcl/installer";
import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";

import { remote, app as mainApp, App } from "electron";

let app: App;
if (process && process.type == "renderer") {
	app = remote.app;
}
else {
	app = mainApp;
}

export class InstanceSave implements Installer.VersionMeta {
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
	public installed: boolean = false;
	public time: string;
	/**
	 * Create a save from VersionMeta
	 */
	public constructor(name: string, data: Installer.VersionMeta) {
		this.name = name;
		this.id = data.id;
		this.type = data.type;
		this.releaseTime = data.releaseTime;
		this.lastPlayed = "never"; // now
		this.clientType = "vanilla";
		this.url = data.url;
		this.time = data.time;
	}

	/**
	 * Install this version
	 */
	public async install() {
		const location: MinecraftLocation = new MinecraftFolder(path.join(app.getPath("userData"), "./game/"));
		let res = await Installer.install("client", this, location);
		this.installed = true;
	}
}
