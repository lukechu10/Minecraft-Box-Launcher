/**
 * @param str strings to be printed out
 */
export function debug(...str: string[]) {
	console.log(`[DEBUG] ${str.join("")}`);
}