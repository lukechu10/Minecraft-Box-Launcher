import Store from "electron-store";
import GlobalSettingsStore from "./store/GlobalSettingsStore";

export namespace ApplicationStore {
	// TODO: rename exports to PascalCase
	export var installed: Store = new Store({
		name: "installed",
		defaults: {
			installed: []
		}
	});

	/**
	 * Cached versions meta
	 */
	export var versionsMetaCache: Store = new Store({
		name: "versionsMetaCache",
		defaults: {
			versions: []
		}
	});

	/**
	 * Global settings
	 */
	export var GlobalSettings: GlobalSettingsStore = new GlobalSettingsStore();
}
