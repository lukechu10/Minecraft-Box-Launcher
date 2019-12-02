/**
 * @param str strings to be printed out
 */
export function debug(...str: any[]): void {
	console.log("[DEBUG] ", ...str);
}
