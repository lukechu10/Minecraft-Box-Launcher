import { Auth } from "@xmcl/auth";

import { ApplicationStore } from "../../universal/store";
import { Render } from "../Render";
import * as consoleUtils from "../../universal/consoleUtils";

export namespace AuthenticationController {
	/**
	 * Sends a request Yggdrasil auth server and stores the returned data
	 * @param username Minecraft email
	 * @param password Minecraft password
	 */
	export async function login(username: string, password: string): Promise<Auth.Response> {
		const authFromMojang: Auth.Response = await Auth.Yggdrasil.login({ username, password }); // official login
		// save data to electron store
		ApplicationStore.auth.set(authFromMojang);
		ApplicationStore.auth.set("loggedIn", true);
		Render.updateLoginStatus("login");
		return authFromMojang;
	}
	/**
	 * Logouts user and resets store
	 */
	export async function logout(): Promise<void> {
		const authData = ApplicationStore.auth.store as Auth.Response & { loggedIn: boolean };
		// invalidate tokens
		const accessToken: string = authData.accessToken;
		const clientToken: string = authData.clientToken;
		consoleUtils.debug("Invalidating access/client pair.");
		Auth.Yggdrasil.invalidate({ accessToken, clientToken });

		// clear store
		ApplicationStore.auth.clear();
		ApplicationStore.auth.set("loggedIn", false);
		Render.updateLoginStatus("logout");
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
			const authData = ApplicationStore.auth.store as Auth.Response & { loggedIn: boolean };
			const accessToken: string = authData.accessToken;
			const clientToken: string = authData.clientToken;


			const valid: boolean = await Auth.Yggdrasil.validate({ accessToken, clientToken });
			if (!valid) {
				try {
					const newAuth: Auth.Response = await Auth.Yggdrasil.refresh({ accessToken, clientToken });
					console.log(newAuth);

					consoleUtils.debug("Refreshing auth. New auth value: ", newAuth);
					// save new auth to store
					ApplicationStore.auth.clear();
					ApplicationStore.auth.set(newAuth);
					ApplicationStore.auth.set("loggedIn", true);
				}
				catch (err) {
					// user needs to login again
					console.error(err);
					logout();
					Render.showLoginModal();
				}
			}
		}
	}
}
