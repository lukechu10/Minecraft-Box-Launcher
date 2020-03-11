import { AuthenticationController } from "./controllers/AuthenticationController";

import "./components/NewInstanceModal";
import NewInstanceModal from "./components/NewInstanceModal";

export * from "./controllers/SettingsModal";

/**
 * Shows new instance window
 * @deprecated
 */
export function newInstance(): void {
	// $("#modal-newInstance").replaceWith(newInstanceModal({ name }));
	// $("#modal-newInstance").modal({
	// 	closable: false
	// }).modal("show");

	// NewInstanceController.attachEvents(); // attach events
	(document.getElementById("modal-newInstance") as NewInstanceModal).render();
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
					console.log("An unknown error occured when trying to login user. Caught exception: ", e);
				}
			}
		}
		else {
			$("#login-errors").text("Please fill out the form!");
		}
	});
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

	initiateLoginForm();
}
