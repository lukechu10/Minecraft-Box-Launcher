import accountModalTemplate from "../templates/AccountModal.pug";
import AuthStore from "../store/AuthStore";

export default class AccountModal extends HTMLDivElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void { }

	public render(): void {
		console.log(AuthStore.store);
		this.innerHTML = accountModalTemplate(AuthStore.store);
		$(this).modal({
			allowMultiple: false
		}).modal("show");
	}
}

$(() => {
	document.getElementById("account-modal-link")?.addEventListener("click", () => { 
		(document.getElementById("modal-account") as AccountModal | null)?.render();
	});
});
customElements.define("modal-account", AccountModal, { extends: "div" });
