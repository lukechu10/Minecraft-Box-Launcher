import { ApplicationStore } from "../universal/store";
import { InstanceController } from "./controllers/InstanceController";
import { AuthenticationController } from "./controllers/AuthenticationController";

import { ipcRenderer } from "electron";
import { LaunchController } from './controllers/LaunchController';

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

	declare function instanceconfirmdeleteTemplate(data: any): string;
	/**
	 * Renders and shows the confirm delete modal
	 * @param opts arguments to pass to pugjs
	 */
	export function instanceConfirmDelete({ name, onApprove, onDeny }: { name: string, onApprove: () => any, onDeny: () => any }) {
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
					// send request to Yggsdrasil auth server
					await AuthenticationController.login($("#username-field").val() as string,
						$("#password-field").val() as string);
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

	declare function instancerenameTemplate(data: any): string;
	/**
	 * Show rename modal
	 */
	export function renameModal({ name, onApprove, onDeny }: { name: string, onApprove: () => any, onDeny: () => any }): void {
		// render html
		$("#modal-rename").html(instancerenameTemplate({ name }));
		// show modal
		$("#modal-rename").modal({
			closable: false,
			onApprove,
			onDeny
		}).modal("show");
	}

	declare function instancecorruptedTemplate(data: any): string;

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
