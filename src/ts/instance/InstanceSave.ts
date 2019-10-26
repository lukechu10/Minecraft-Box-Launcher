import path from "path";
import { app } from "electron";
import { Installer } from "@xmcl/installer";
import { MinecraftLocation } from "@xmcl/util";

export default class InstanceSave implements Installer.VersionMeta {
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
	lastPlayed: Date;
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
		this.lastPlayed = new Date(); // now
		this.clientType = "vanilla";
		this.url = data.url;
		this.time = data.time;
	}

	/**
	 * Install this version
	 */
	install = () => {
		const location: MinecraftLocation = path.join(app.getPath("userData"), "./instances/");
		console.log(location);
	};
}