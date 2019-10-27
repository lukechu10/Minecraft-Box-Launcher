import { Auth } from "@xmcl/auth";

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
	updateLoginStatus("login");
	return authFromMojang;
}

/**
 * Logouts user and resets store
 */
export async function logout(): Promise<void> {
	store.auth.clear();
	store.auth.set("loggedIn", false);
	updateLoginStatus("logout");
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
 * Show form on click if logged out
 */
function initiateLoginForm(): void {
	// initiate form
	$("#login-form").form({
		fields: {
			username: {
				identifier: "username",
				rules: [{
					type: "email",
					prompt: "Invalid email"
				}]
			},
			password: {
				identifier: "password",
				type: "minLength[1]",
				prompt: "Please enter your password"
			}
		}
	} as any);

	// login button
	$("#login-form").submit(async (event: JQuery.Event) => {
		event.preventDefault();
		$("#login-form").form("validate form");
		if ($("#login-form").form("is valid")) {
			try {
				// send request to Yggsdrasil auth server
				await login($("#username-field").val() as string,
					$("#password-field").val() as string);
				// login successfull
				$("#login-modal").modal("hide");
			}
			catch (e) {
				$("#login-errors-container").css("display", "block");
				// if invalid credentials
				if (e.statusCode == 403) {
					$("#login-errors").text("Invalid username or password!");
				}
				else {
					$("#login-errors").text("An unknown error occured: " + e);
				}
			}
		}
		else {
			$("#login-errors").text("Please fill out the form!");
		}
	});
}

// TODO: Move declare to new file
declare function loginstatusTemplate(opts?: any): string;
/**
 * Updates the login status in the navigation
 */
export function updateLoginStatus(status: "login" | "logout"): void {
	/*
	if (status == "logout") {
		$("#login-status-text").text("Log in");
		$("#login-status").attr("onclick", "auth.showLoginModal()");
		$("#login-status").dropdown("hide").dropdown("destroy");
		initiateLoginForm();
	}
	else if (status == "login") {
		// show user profile name
		const skinUrl = `https://minotar.net/avatar/${store.auth.get("profiles")[0].name}`;
		$("#login-status-text").html(store.auth.get("profiles")[0].name +
		`<img src='${skinUrl}' style='margin-left: 5px; width: 18px;'>`);
		$("#login-status").attr("onclick", "");

		// user popup
		$("#login-status").dropdown();
}
	*/
	if (status == "logout") {
		$("#login-status").html(loginstatusTemplate({ loggedIn: false }));
		initiateLoginForm();
	}
	else if (status == "login") {
		$("#login-status").html(loginstatusTemplate({ loggedIn: true, name: store.auth.get("profiles")[0].name }));
		// user popup
		$("#login-status").dropdown();
	}
	else {
		throw `Option ${status} is not availible for argument status`;
	}
}