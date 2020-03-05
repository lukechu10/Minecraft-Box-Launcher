import { Authentication, login as uLogin, refresh, validate, invalidate } from "@xmcl/user";

import { ApplicationStore } from "../store";
import * as Render from "../Render";

export namespace AuthenticationController {
	/**
	 * Sends a request Yggdrasil auth server and stores the returned data
	 * @param username Minecraft email
	 * @param password Minecraft password
	 */
	export async function login(username: string, password: string): Promise<Authentication> {
		const authFromMojang: Authentication = await uLogin({ username, password }); // official login
		// save data to electron store
		ApplicationStore.auth.set({ ...authFromMojang, loggedIn: true });
		return authFromMojang;
	}
	/**
	 * Logouts user and resets store
	 */
	export async function logout(): Promise<void> {
		const authData = ApplicationStore.auth.store as Authentication & { loggedIn: boolean };
		// invalidate tokens
		const accessToken: string = authData.accessToken;
		const clientToken: string = authData.clientToken;
		console.log("Invalidating access/client pair.");
		invalidate({ accessToken, clientToken });

		// clear store
		ApplicationStore.auth.set("loggedIn", false);
		return;
	}
	/**
	 * Verifies that login is still valid. This function should be called on app startup
	 * @throws if user is not logged in
	 */
	export async function refreshLogin(): Promise<void> {
		if (ApplicationStore.auth.get("loggedIn") == false) {
			throw "User is not logged in. Cannot refresh auth.";
		}
		else {
			const authData = ApplicationStore.auth.store as Authentication & { loggedIn: boolean };
			const accessToken: string = authData.accessToken;
			const clientToken: string = authData.clientToken;


			const valid: boolean = await validate({ accessToken, clientToken });
			if (!valid) {
				try {
					const newAuth = await refresh({ accessToken, clientToken });

					console.log("Refreshing auth. New auth value: ", newAuth);
					// save new auth to store
					ApplicationStore.auth.set({ ...newAuth, loggedIn: true });
				}
				catch (err) {
					// user needs to login again
					if (err != "TypeError: Failed to fetch") { // not offline
						console.error(err);
						logout();
						Render.showLoginModal();
					}
				}
			}
		}
	}
}
