import { Authentication } from "@xmcl/user";
import authModalTemplate from "../templates/AuthModal.pug";
import { AuthenticationController } from "../controllers/AuthenticationController"; // TODO: temp, remove dep
import AuthStore from "../store/AuthStore";

export class AuthModal extends HTMLDivElement {
	public constructor() {
		super();
	}
	public connectedCallback(): void { }
	public render(message?: string): void {
		this.innerHTML = authModalTemplate();
		$(this).modal({
			closable: false,
			detachable: false
		}).modal("show");
		this.attachEvents();
		if (message !== undefined) this.setErrorMessage(message);
	}
	/**
	 * Returns the auth from user login or `null` if canceled
	 */
	public async waitForAuth(message?: string): Promise<Authentication | null> {
		if (message !== undefined) this.setErrorMessage(message);
		return new Promise((resolve) => {
			this.innerHTML = authModalTemplate();
			$(this).modal({
				closable: false,
				detachable: false,
				onHidden: () => {
					if (AuthStore.store.loggedIn) {
						resolve(AuthStore.store);
					}
					else resolve(null);
				}
			}).modal("show");
			this.attachEvents();
			resolve(null); // error
		});
	}
	private attachEvents(): void {
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
					if (e.statusCode == 403) { // invalid credentials
						this.setErrorMessage("Invalid username or password! Please try again.");
					}
					else {
						this.setErrorMessage(`An unknown error occured: ${e}`);
						console.log("An unknown error occured when trying to login user. Caught exception: ", e);
					}
				}
			}
			else {
				this.setErrorMessage("Please fill out the form!");
			}
		});
	}
	/**
	 * @param message message to be set in the error message box or hide if `null`.
	 */
	private setErrorMessage(message: string | null) {
		if (message !== null) {
			(document.getElementById("login-errors-container") as HTMLDivElement).style.display = "block";
			(document.getElementById("login-errors") as HTMLDivElement).textContent = message;
		}
		else {
			(document.getElementById("login-errors-container") as HTMLDivElement).style.display = "none";
		}
	}
}

customElements.define("modal-auth", AuthModal, { extends: "div" });
