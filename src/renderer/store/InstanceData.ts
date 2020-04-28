import { Installer } from "@xmcl/installer";

/**
 * InstanceSave without methods
 */
export interface InstanceData extends Installer.Version {
	/**
	 * Name of instance
	 */
	name: string;
	/**
	 * UUID v4 to identify the instance
	 */
	uuid: string;
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
	installed: boolean;
	/**
	 * Is instance currently being installed
	 */
	isInstalling: boolean;
	time: string;
	[key: string]: string | boolean;
}
