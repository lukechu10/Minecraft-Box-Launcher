import { Authentication } from "@xmcl/user";
import { remote } from "electron";
import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { AuthenticationController } from "../controllers/AuthenticationController"; // TODO: temp, remove dep
import AuthStore from "../store/AuthStore";

const shell = remote.shell;

@customElement("auth-modal")
export class AuthModal extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: String }) protected errorMessage = "";

	protected render(): TemplateResult {
		return html`
			<div class="header">Login</div>
			<div class="content">
				<div class="ui centered grid">
					<div class="row">
						<div class="twelve wide column">
							<!-- error messages -->
							${this.errorMessage !== "" ? html`
								<div class="ui tertiary inverted red segment" id="login-errors-container">
									<p id="login-errors">${this.errorMessage}</p>
								</div>
							` : ""}
							<!-- login form -->
							<form class="ui form segment error" id="login-form" @submit="${this.handleSubmit}" onsubmit="return false;">
								<div class="field">
									<label>Mojang Email</label>
									<input id="username-field" type="text" name="username" placeholder="Email">
								</div>
								<div class="field">
									<label tabindex="-1">
										Password
										(<a @click="${this.openForgotPasswordLink}">Forgot your password?</a>)
									</label>
									<input id="password-field" type="password" name="password" placeholder="Password">
								</div>
								<button type="submit" class="ui fluid positive button" id="login-btn">Login</button>
								<div class="ui horizontal divider">or</div>
								<div class="actions">
									<div style="text-align: center">
										<button class="ui tiny inverted red cancel button">Continue without logging in</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	/**
	 * Opens the mojang forgot my password link in default browser
	 */
	private openForgotPasswordLink(): void {
		shell.openExternal("https://my.minecraft.net/en-us/password/forgot/");
	}

	/**
	 * @param message message to be shown in error message area
	 * @returns the authentication data or `null` if none
	 */
	public async showModal(message?: string): Promise<Authentication | null> {
		this.errorMessage = message ?? "";

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
					rules: [{
						type: "minLength[1]",
						prompt: "You must enter your password"
					}]
				}
			}
		});

		return new Promise((resolve) => {
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
		});
	}

	private handleSubmit(e: Event): false {
		e.preventDefault();
		const $form = $("#login-form");
		(async (): Promise<void> => {
			$form.form("validate form");
			if ($form.form("is valid")) {
				try {
					const username = this.querySelector<HTMLInputElement>("#username-field")!.value;
					const password = this.querySelector<HTMLInputElement>("#password-field")!.value;

					// send request to Yggsdrasil auth server
					await AuthenticationController.login(username, password);
					// login successfull
					$(this).modal("hide");
				} catch (error) {
					if (error.statusCode == 403) {
						this.errorMessage = "Invalid username or password! Please try again.";
					}
					else {
						this.errorMessage = `An unknown error occured: ${error}`;
						console.warn("An unknown error occured when trying to log in user:", error);
					}
				}
			}
			else
			// form is invalid
			{
				this.errorMessage = "Please fill out the form!";
			}
		})();
		return false;
	}
}
