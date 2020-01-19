import Store from "electron-store";
import { JavaInstaller } from "@xmcl/java-installer"; // TODO: remove package from package.json once feature has been released to master

export interface GlobalSettings {
	/**
	 * Java options
	 */
	java: {
		useBundledJava: boolean,
		/**
		 * Path to java executable if not using bundled java
		 */
		externalJavaPath?: string
	}
}

export default class GlobalSettingsStore extends Store<GlobalSettings> {
	private static defaultSettings: GlobalSettings = {
		java: {
			useBundledJava: true
		}
	}

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