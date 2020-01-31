import Store from "electron-store";
import InstanceStore from "./store/InstanceStore";
import GlobalSettingsStore from "./store/GlobalSettingsStore";

export namespace ApplicationStore {
	// TODO: rename exports to PascalCase
	export var instances: InstanceStore = new InstanceStore();

	export var installed: Store = new Store({
		name: "installed",
		defaults: {
			installed: [

			]
		}
	});

	export var auth: Store = new Store({
		name: "auth",
		defaults: {
			loggedIn: false
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
