import { LitElement, html, customElement, property } from "lit-element";

import AuthStore, { AuthStoreData } from "../store/AuthStore";

@customElement("modal-account")
export default class AccountModal extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public authData: AuthStoreData | { loggedIn: false } = AuthStore.store;

	protected render() {
		return html`
			<div class="header">Account</div>
			<div class="content">
				<div class="ui large list">
					<div class="item">
						${this.authData.loggedIn ? html`
							<img class="ui avatar image" src="https://minotar.net/avatar/${this.authData.selectedProfile.id}" alt="skin head">
							<div class="content">
								<div class="header" style="display: inline-block;">${this.authData.selectedProfile.name}</div>
								<div class="description">(UUID: <span style="user-select: all;">${this.authData.selectedProfile.id}</span></div>
							</div>
							<div class="right floated content">
								<button class="ui right floated red button" onclick="AuthenticationController.logout()">
									<i class="fas fa-sign-out-alt"></i> Logout
								</button>
							</div>
						`: html`
						<div class="content" style="display: inline-block;">
							<div class="header">You have not logged in to your Minecraft account yet.</div>
							<div class="description">Log in now to start playing and to unlock all the goodies!</div>
						</div>
						<div class="right floated content"><button class="ui primary button" onclick="Render.showLoginModal()">Login</button></div>
						`}
					</div>
				</div>
			</div>
		`;
	}

	public showModal(): void {
		$(this).modal("show");
	}
}

$(() => {
	document.getElementById("account-modal-link")?.addEventListener("click", () => {
		(document.getElementsByTagName("modal-account")[0] as AccountModal | null)?.showModal();
	});
});

const changeCallback = () => {
	console.log("Auth store changed, rendering account modal");
	const target = document.getElementsByTagName("modal-account")[0] as AccountModal | null;
	if (target !== null) {
		target.authData = AuthStore.store;
		target.requestUpdate();
	}
};
// @ts-expect-error
AuthStore.onDidChange("selectedProfile.name", changeCallback);
AuthStore.onDidChange("loggedIn", changeCallback);
