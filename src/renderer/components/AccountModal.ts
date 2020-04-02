import accountModalTemplate from "../templates/AccountModal.pug";
import AuthStore from "../store/AuthStore";

export default class AccountModal extends HTMLDivElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void { }

	public render(): void {
		this.innerHTML = accountModalTemplate(AuthStore.store);
		$(this).modal({
			allowMultiple: false
		}).modal("show");
	}

	public refresh(): void {
		this.innerHTML = accountModalTemplate(AuthStore.store);
	}
}

$(() => {
	document.getElementById("account-modal-link")?.addEventListener("click", () => {
		(document.getElementById("modal-account") as AccountModal | null)?.render();
	});
	$(document).on("click", "#account-modal-link-home", () => {
		(document.getElementById("modal-account") as AccountModal | null)?.render();
	});
});

const changeCallback = () => {
	console.log("Auth store changed, rendering account modal");
	document.querySelector<AccountModal>("#modal-account")?.refresh();
};
// @ts-ignore
AuthStore.onDidChange("selectedProfile.name", changeCallback);
AuthStore.onDidChange("loggedIn", changeCallback);

customElements.define("modal-account", AccountModal, { extends: "div" });
