import accountModalTemplate from "../templates/AccountModal.pug";

export default class AccountModal extends HTMLDivElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		// attach handler
		document.getElementById("account-modal-link")?.addEventListener("click", () => { this.render(); });
	}

	public render(): void {
		this.innerHTML = accountModalTemplate();
		$(this).modal("show");
	}
}

customElements.define("modal-account", AccountModal, { extends: "div" });
