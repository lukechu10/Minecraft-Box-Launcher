import { JavaInstaller, JavaInfo } from "@xmcl/java-installer"; // TODO: remove package from package.json once feature has been released to master
import path from "path";
import { remote } from "electron";

/**
 * Find installed java path
 */
export async function checkInstalled(): Promise<JavaInfo[]> {
	const info = await JavaInstaller.scanLocalJava([]);
	return info;
}
