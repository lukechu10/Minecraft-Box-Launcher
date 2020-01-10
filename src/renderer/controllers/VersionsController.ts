import { ApplicationStore } from "../store"

import { Installer } from "@xmcl/installer";

export namespace VersionsController {
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
			ApplicationStore.versionsMetaCache.set("versions", versionsMeta.versions);
			return versionsMeta.versions;
		}
	}
}
