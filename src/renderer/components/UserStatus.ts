import userStatusTemplate from "../templates/UserStatus.pug";
import { ApplicationStore } from "../store";

/**
 * Custom element for user status in menu bar
 */
export default class UserStatus extends HTMLElement {
	public constructor() {
		super();

		ApplicationStore.auth.onDidAnyChange(() => {
			console.log("Auth store changed, rendering user status");
			this.render();
		});
	}

	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		this.classList.add("item", "ui", "dropdown");

		const authData = ApplicationStore.auth.store; // get data from store
		if (!authData.loggedIn)
			this.innerHTML = userStatusTemplate({ loggedIn: false });
		else
			this.innerHTML = userStatusTemplate({ loggedIn: true, name: ApplicationStore.auth.get("selectedProfile").name });
		$(this).dropdown();
	}
}

customElements.define("user-status", UserStatus);
