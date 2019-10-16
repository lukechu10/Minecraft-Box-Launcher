// import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";
import { Installer } from "@xmcl/installer";

export default class InstanceSave {
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
	type?: string;
	/**
     * Type of client
     */
	clientType: "vanilla" | "forge";
	lastPlayed: Date;
	/**
	 * Date version was released
	 */
	releaseTime: Date;
	url?: string;

	/**
	 * Create a save from VersionMeta
	 */
	constructor(name: string, data: Installer.VersionMeta) {
		this.name = name;
		this.id = data.id;
		this.type = data.type;
		this.releaseTime = new Date(data.releaseTime);
		this.lastPlayed = new Date(); // now
		this.clientType = "vanilla";
	}
}