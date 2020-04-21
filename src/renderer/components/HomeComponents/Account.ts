import template from "../../templates/HomeComponents/Account.pug";

import type AccountModal from "../AccountModal";
import AuthStore from "../../store/AuthStore";

class Account extends HTMLElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		this.innerHTML = template(AuthStore.store);

		document.getElementById("account-modal-link-home")?.addEventListener("click", () => {
			(document.getElementById("modal-account") as AccountModal | null)?.showModal();
		});
	}
}

const changeCallback = () => {
	console.log("Auth store changed, rendering account modal");
	document.querySelector<Account>("home-account")?.render();
};
// @ts-ignore
AuthStore.onDidChange("selectedProfile.name", changeCallback);
AuthStore.onDidChange("loggedIn", changeCallback);

customElements.define("home-account", Account);
