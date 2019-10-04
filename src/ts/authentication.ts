import { Auth } from "@xmcl/minecraft-launcher-core";

import * as store from "./store";

/**
 * Sends a request Yggdrasil auth server and stores the returned data
 * @param username Minecraft email
 * @param password Minecraft password
 */
export async function login(username: string, password: string): Promise<Auth> {
	const authFromMojang: Auth = await Auth.Yggdrasil.login({ username, password }); // official login
	// save data to electron store
	store.auth.set(authFromMojang);
	store.auth.set("loggedIn", true);
	updateLoginStatus();
	return authFromMojang;
}

/**
 * Logouts user and resets store
 */
export async function logout(): Promise<void> {
	store.auth.clear();
	store.auth.set("loggedIn", false);
	updateLoginStatus();
	return;
}

/**
 * Shows modal that appears over page
 */
export function showLoginModal(): void {
	$("#login-modal").modal({
		onDeny: () => {
			// show are you sure message
		}
	}).modal("show");
}

/**
 * Updates the login status in the navigation
 */
export function updateLoginStatus(): void {
	if (store.auth.get("loggedIn", false) == false) {
		$("#login-status").html("Log in");
		$("#login-status").attr("onclick", "auth.showLoginModal()");
		$("#login-status").popup("hide").popup("destroy");
	}
	else {
		// show user profile name
		const skinUrl = `https://minotar.net/avatar/${store.auth.get("profiles")[0].name}`;
		$("#login-status").html(store.auth.get("profiles")[0].name +
		/* skin head */ `<img src='${skinUrl}' style='margin-left: 5px; width: 25px;'>`);
		$("#login-status").attr("onclick", "");

		// user popup
		$("#login-status").popup({
			inline: true,
			position: "top right",
			delay: {
				hide: 500
			},
			hoverable: true
		});
	}
}