import template from "../../templates/HomeComponents/Account.pug";

import type AccountModal from "../AccountModal";

class Account extends HTMLElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		this.innerHTML = template();

		document.getElementById("account-modal-link-home")?.addEventListener("click", () => {
			(document.getElementById("modal-account") as AccountModal | null)?.render();
		});
	}
}

customElements.define("home-account", Account);
