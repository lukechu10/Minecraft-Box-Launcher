import { ApplicationStore } from "../store";

import { Installer } from "@xmcl/installer";

export namespace VersionsController {
	/**
	 * Sends a request to mojang versions list and saves result in electron store
	 * @returns list of all availible vanilla versions or null if error
	 */
	export async function updateVersionMeta(): Promise<Installer.VersionList | null> {
		// const versionsMeta = await Installer.getVersionList();
		// FIXME: wait for fix
		const versionsMeta = await (await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")).json() as Installer.VersionList;
		if (!versionsMeta)
			return null;
		else {
			// save to electron store
			ApplicationStore.versionsMetaCache.set(versionsMeta);
			return versionsMeta;
		}
	}
}
