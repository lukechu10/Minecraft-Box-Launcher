import { scanLocalJava, JavaInfo } from "@xmcl/installer/java";

/**
 * Find installed java path
 */
export async function checkInstalled(): Promise<JavaInfo[]> {
	const info = await scanLocalJava([]);
	return info;
}
