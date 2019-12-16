import { ApplicationStore } from "../universal/store";
import { InstanceController } from "./controllers/InstanceController";
import { AuthenticationController } from "./controllers/AuthenticationController";

// TODO: remove workaround
import * as NewInstanceController from "./controllers/NewInstanceWindow"; // attach event handlers

import * as consoleUtils from "../universal/consoleUtils";

// import templates
import loginstatusTemplate from "./templates/loginStatus.pug";

import newInstanceModal from "./templates/modals/newInstance.pug";
import { attachEvents } from "./controllers/NewInstanceWindow";

export * from "./views/instances";

/**
 * Shows new instance window
 */
export function newInstance(): void {
	$("#modal-newInstance").replaceWith(newInstanceModal({ name }));
	$("#modal-newInstance").modal({
		closable: false
	}).modal("show");

	NewInstanceController.attachEvents(); // attach events
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
				const username = $("#username-field").val() as string;
				const password = $("#password-field").val() as string;
				// send request to Yggsdrasil auth server
				await AuthenticationController.login(username, password);
				// login successfull
				$("#modal-login").modal("hide");
			}
			catch (e) {
				$("#login-errors-container").css("display", "block");
				// if invalid credentials
				if (e.statusCode == 403) {
					$("#login-errors").text("Invalid username or password!");
				}
				else {
					$("#login-errors").text("An unknown error occured: " + e);
					consoleUtils.debug("An unknown error occured when trying to login user. Caught exception: ", e);
				}
			}
		}
		else {
			$("#login-errors").text("Please fill out the form!");
		}
	});
}

/**
 * Updates the login status in the navigation
 */
export function updateLoginStatus(status: "login" | "logout"): void {
	if (status == "logout") {
		$("#login-status").html(loginstatusTemplate({ loggedIn: false }));
		initiateLoginForm();
	}
	else if (status == "login") {
		$("#login-status").html(loginstatusTemplate({ loggedIn: true, name: ApplicationStore.auth.get("selectedProfile").name }));
		// user popup
		$("#login-status").dropdown();
	}
	else {
		throw `Option ${status} is not availible for argument status`;
	}
}

/**
 * Shows modal that appears over page
 */
export function showLoginModal(): void {
	// TODO: allow option to customize error message on show (for session expired)
	$("#modal-login").modal({
		onDeny: () => {
			// TODO: show are you sure message
		},
		detachable: false
	}).modal("show");
}
