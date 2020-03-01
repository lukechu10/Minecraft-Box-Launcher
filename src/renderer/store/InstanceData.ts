/**
 * InstanceSave without methods
 */
export interface InstanceData {
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
	installed: boolean;
	time: string;
	[key: string]: any;
}
