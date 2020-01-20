import Store from "electron-store";

export interface GlobalSettings {
	/**
	 * Java options
	 */
	java: {
		/**
		 * Path to java executable if not using bundled java
		 */
		externalJavaPath: string,
	}
}

export default class GlobalSettingsStore extends Store<GlobalSettings> {
	private static defaultSettings: GlobalSettings = {
		java: {
			externalJavaPath: ""
		}
	};

	public constructor() {
		super({
			name: "global_settings",
			accessPropertiesByDotNotation: true,
			defaults: GlobalSettingsStore.defaultSettings
		});
	}

	public get allSettings(): GlobalSettings {
		return this.store;
	}
}
