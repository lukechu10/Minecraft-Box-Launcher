import { versionsMetaCache } from "../universal/store";

import { Installer } from "@xmcl/installer";
import { remote } from "electron";
const app = remote.app;

/**
 * Sends a request to mojang versions list and saves result in electron store
 * @returns list of all availible vanilla versions or null if error
 */
export async function updateVersionMeta(): Promise<Installer.VersionMeta[] | null> {
	const versionsMeta = await Installer.updateVersionMeta();
	if (!versionsMeta)
		return null;
	else {
		// save to electron store
		versionsMetaCache.set("versions", versionsMeta.versions);
		return versionsMeta.versions;
	}
}

// export var api = require("@xmcl/minecraft-launcher-core");