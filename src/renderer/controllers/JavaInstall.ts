import { scanLocalJava, JavaInfo } from "@xmcl/installer/java"; // TODO: remove package from package.json once feature has been released to master

/**
 * Find installed java path
 */
export async function checkInstalled(): Promise<JavaInfo[]> {
	const info = await scanLocalJava([]);
	return info;
}
