import { ApplicationStore } from "../universal/store";
import { InstanceController } from "./controllers/InstanceController";
import { AuthenticationController } from "./controllers/AuthenticationController";

import { ipcRenderer } from "electron";
import { LaunchController } from "./controllers/LaunchController";

import * as consoleUtils from "../universal/consoleUtils";

// import templates
import instancelistTemplate from "./templates/instanceList.pug";
import instanceconfirmdeleteTemplate from "./templates/instanceConfirmDelete.pug";
import loginstatusTemplate from "./templates/loginStatus.pug";
import instancecorruptedTemplate from "./templates/instanceCorrupted.pug";

// import modal templates
import instanceRenameModal from "./templates/modals/instanceRename.pug"

export namespace Render {
	/**
	 * Renders instance list on instance page
	 */
	export function instanceList(): void {
		$("#instance-list").html(instancelistTemplate({ data: ApplicationStore.instances.all }));
		$(".ui.dropdown").dropdown();
		return;
	}
	/**
	 * Shows new instance window
	 */
	export function newInstance(): void {
		ipcRenderer.sendSync("showWindow-newInstance");
	}
	/**
	 * Shows instance options window
	 * @param name name of instance
	 */
	export function instanceOptions(name: string): void {
		const result = ipcRenderer.sendSync("showWindow-instanceOptions", name);
		if (result.success === false) {
			throw Error("Error returned from main process");
		}
	}

	/**
	 * Renders and shows the confirm delete modal
	 * @param opts arguments to pass to pugjs
	 */
	export function instanceConfirmDelete({ name, onApprove, onDeny }: { name: string, onApprove: () => any, onDeny: () => any }): void {
		// render html
		$("#modal-confirmDelete").html(instanceconfirmdeleteTemplate({ name }));
		// show modal
		$("#modal-confirmDelete").modal({
			closable: false,
			onApprove,
			onDeny
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
			}
		}).modal("show");
	}

	/**
	 * Show rename modal
	 */
	export function renameModal({ name, onApprove, onDeny }: { name: string, onApprove: () => any, onDeny: () => any }): void {
		// render html
		/*
		$("#modal-rename").html(instancerenameTemplate({ name }));
		// show modal
		$("#modal-rename").modal({
			closable: false,
			onApprove,
			onDeny
		}).modal("show");
		*/
		$(instanceRenameModal({ name })).modal({
			closable: false,
			onApprove,
			onDeny
		}).modal("show");
	}

	/**
	 * Show instance is corrupted modal
	 */
	export function corruptedModal({ name, onApprove, onDeny }: { name: string, onApprove: () => any, onDeny: () => any }): void {
		// render html
		$("#modal-instanceCorrupted").html(instancecorruptedTemplate({ name }));
		// show modal
		$("#modal-instanceCorrupted").modal({
			closable: false,
			onApprove,
			onDeny
		}).modal("show");
	}
}
// attach event handlers
$(document).on("click", ".btn-install", e => {
	// install instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// install by name
	InstanceController.installByName(name);
	// update text
	// TODO: add as member to InstanceSave to save text when switching pages
	$(e.currentTarget).text("Installing...").removeClass("olive").attr("id", "").addClass(["gray", "disabled"]);
}).on("click", ".btn-reinstall", e => {
	// install instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// install by name
	InstanceController.installByName(name);
	// update text
	// TODO: add as member to InstanceSave to save text when switching pages
	$(`.btn-play[data-instance-name=${name}]`).text("Installing...").removeClass("green").attr("id", "").addClass(["gray", "disabled"]);
}).on("click", ".btn-play", e => {
	// launch instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// launch by name
	LaunchController.launch(name);
}).on("click", ".btn-delete", e => {
	// delete instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// show prompt
	Render.instanceConfirmDelete({
		name,
		onApprove: () => {
			// delete instance
			InstanceController.deleteInstance(name);
		},
		onDeny: () => {
			// close modal
		}
	});
}).on("click", ".btn-rename", e => {
	// rename instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	Render.renameModal({
		name,
		onApprove: () => {
			const find = ApplicationStore.instances.findFromName($("#input-rename").val() as string); // make sure an instance with this name does not already exist
			if (find !== undefined) {
				alert("An instance with this name already exists"); // TODO: Change to modal to match rest of UI FIXME: Clicking on OK in alert removes focus from input. No longer able to focus on input unless the window is unfocused and focused again
				return false;
			}
			else
				InstanceController.renameInstance(name, $("#input-rename").val() as string);
		},
		onDeny: () => {
			// close modal
		}
	});
}).on("click", ".btn-options", e => {
	// open options window
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	Render.instanceOptions(name);
});
