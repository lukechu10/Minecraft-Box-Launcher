import accountModalTemplate from "../templates/AccountModal.pug";
import AuthStore from "../store/AuthStore";

export default class AccountModal extends HTMLDivElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		// attach handler
		document.getElementById("account-modal-link")?.addEventListener("click", () => { this.render(); });
	}

	public render(): void {
		console.log(AuthStore.store);
		this.innerHTML = accountModalTemplate(AuthStore.store);
		$(this).modal({
			allowMultiple: false
		}).modal("show");
	}
}

customElements.define("modal-account", AccountModal, { extends: "div" });
