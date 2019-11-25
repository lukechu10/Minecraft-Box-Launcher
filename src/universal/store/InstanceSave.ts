import path from "path";
import { remote } from "electron";
const app = remote.app;
import { Installer } from "@xmcl/installer";
import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";

export class InstanceSave implements Installer.VersionMeta {
	/**
     * Name of instance
     */
	name: string;
	/**
     * Instance version
     */
	id: string;
	/**
     * Mojang release or snapshot (vanilla only)
     */
	type: string;
	/**
     * Type of client
     */
	clientType: "vanilla" | "forge";
	/**
	 * Format: `new Date().toISOString()` or `"never"` if never played
	 */
	lastPlayed: string | "never";
	/**
	 * Date version was released
	 */
	releaseTime: string;
	url: string;
	/**
	 * Version binaires are completely installed
	 */
	installed: boolean = false;
	time: string;
	/**
	 * Create a save from VersionMeta
	 */
	constructor(name: string, data: Installer.VersionMeta) {
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
	async install() {
		const location: MinecraftLocation = new MinecraftFolder(path.join(app.getPath("userData"), "./game/"));
		let res = await Installer.install("client", this, location);
		this.installed = true;
	}
}