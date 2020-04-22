import Store from "electron-store";
import GlobalSettingsStore from "./store/GlobalSettingsStore";

export namespace ApplicationStore {
	// TODO: rename exports to PascalCase
	export const installed: Store = new Store({
		name: "installed",
		defaults: {
			installed: []
		}
	});

	/**
	 * Cached versions meta
	 */
	export const versionsMetaCache: Store = new Store({
		name: "versionsMetaCache",
		defaults: {
			versions: []
		}
	});

	/**
	 * Global settings
	 */
	export const GlobalSettings: GlobalSettingsStore = new GlobalSettingsStore();
}
