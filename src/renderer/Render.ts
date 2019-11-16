import { ApplicationStore } from "../universal/store";
import { InstanceController } from "./controllers/InstanceController";
import { AuthenticationController } from "./controllers/AuthenticationController";

import { ipcRenderer } from "electron";

export namespace Render {
	declare function instancelistTemplate(data: any): string;
	/**
	 * Renders instance list on instance page
	 */
	export function instanceList(): void {
		$("#instance-list").html(instancelistTemplate({ data: ApplicationStore.instances.all }));
		$(".ui.dropdown").dropdown();
		return;
	}
	/**
	 * Shows new instance page
	 */
	export function newInstance(): void {
		ipcRenderer.sendSync("show-window", "newInstance");
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
					await AuthenticationController.login($("#username-field").val() as string,
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
		if (status == "logout") {
			$("#login-status").html(loginstatusTemplate({ loggedIn: false }));
			initiateLoginForm();
		}
		else if (status == "login") {
			$("#login-status").html(loginstatusTemplate({ loggedIn: true, name: ApplicationStore.auth.get("profiles")[0].name }));
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
		$("#login-modal").modal({
			onDeny: () => {
				// show are you sure message
			}
		}).modal("show");
	}
}
	// attach event handlers
	$(document).on("click", "#btn-install", e => {
		const name: string = $(e.currentTarget).attr("data-instance-name") as string;
		// install by name
		InstanceController.installByName(name);
		// update text
		// TODO: add as member to InstanceSave to save text when switching pages
		$(e.currentTarget).text("Installing...").removeClass("olive").attr("id", "").addClass(["gray", "disabled"]);
	}).on("click", "#btn-play", e => {
		const name: string = $(e.currentTarget).attr("data-instance-name") as string;
		// launch by name
		InstanceController.launch(name);
	});