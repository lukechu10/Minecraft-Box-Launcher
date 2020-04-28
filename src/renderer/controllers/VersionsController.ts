import { ApplicationStore } from "../store";

import { getVersionList, VersionList } from "@xmcl/installer/minecraft";

export namespace VersionsController {
	/**
	 * Sends a request to mojang versions list and saves result in electron store
	 * @returns list of all availible vanilla versions or null if error
	 */
	export async function updateVersionMeta(): Promise<VersionList | null> {
		const versionsMeta = await getVersionList();
		// save to electron store
		ApplicationStore.versionsMetaCache.set(versionsMeta);
		return versionsMeta;
	}
}
