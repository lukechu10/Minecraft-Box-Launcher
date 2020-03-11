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
				$("#login-errors-container").css("display", "block");
				$("#login-errors").text("Please fill out the form!");
			}
		});
	}
	/**
	 * Returns the auth from user login or `null` if canceled
	 */
	public async waitForAuth(): Promise<Authentication | null> {
		return new Promise((resolve, reject) => {
			this.innerHTML = authModalTemplate();
			$(this).modal({
				closable: false,
				detachable: false,
				onHidden: () => {
					console.log("ac");
					if (AuthStore.store.loggedIn) {
						resolve(AuthStore.store);
					}
					else resolve(null);
				}
			}).modal("show");
			this.attachEvents();
			reject(null); // error
		});
	}
}

customElements.define("modal-auth", AuthModal, { extends: "div" });
