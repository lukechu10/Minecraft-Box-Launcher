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
		maxMemory: number,
		minMemory: number
	}
}

export default class GlobalSettingsStore extends Store<GlobalSettings> {
	private static defaultSettings: GlobalSettings = {
		java: {
			externalJavaPath: "",
			maxMemory: 1024,
			minMemory: 512
		}
	};

	public constructor() {
		super({
			name: "global_settings",
			accessPropertiesByDotNotation: true,
			defaults: GlobalSettingsStore.defaultSettings
		});
	}
}
