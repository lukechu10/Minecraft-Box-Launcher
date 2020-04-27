import type AccountModal from "../AccountModal";
import AuthStore, { AuthStoreData } from "../../store/AuthStore";
import { LitElement, customElement, TemplateResult, html, property } from "lit-element";

@customElement("home-account")
class Account extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public authData: AuthStoreData | { loggedIn: false; } = AuthStore.store;

	protected render(): TemplateResult {
		return html`
			<h5 class="ui header">My Account</h5>
			<a class="ui top right attached primary label" id="account-modal-link-home" @click="${this.showAccountModal}">Show more</a>

			<div class="ui segment" style="margin-top: 0 !important">
				${this.authData.loggedIn ? html`
					<div class="content">
						<div class="left floated mini ui image">
							<img src="https://minotar.net/avatar/${this.authData.selectedProfile.id}">
						</div>
					</div>
					<strong>${this.authData.selectedProfile.name}</strong>
					<div class="meta">${this.authData.user!.username}</div>
				` : html`
					<p>
						<strong>You are not logged in.</strong>
						Log in now to start playing.
					</p>
				`}
			</div>
		`;
	}

	private showAccountModal(): void {
		document.querySelector<AccountModal>("#modal-account")!.showModal();
	}
}

const changeCallback = (): void => {
	console.log("Auth store changed, rendering account modal");
	const homeAccount = document.querySelector<Account>("home-account");
	if (homeAccount !== null) {
		homeAccount.authData = AuthStore.store;
		homeAccount.requestUpdate();
	}
};
// @ts-ignore
AuthStore.onDidChange("selectedProfile.name", changeCallback);
AuthStore.onDidChange("loggedIn", changeCallback);
