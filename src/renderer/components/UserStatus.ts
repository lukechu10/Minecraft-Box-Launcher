import userStatusTemplate from "../templates/UserStatus.pug";
import AuthStore from "../store/AuthStore";

/**
 * Custom element for user status in menu bar
 */
export default class UserStatus extends HTMLElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		this.classList.add("item", "ui", "dropdown");

		const authData = AuthStore.store; // get data from store
		if (!authData.loggedIn)
			this.innerHTML = userStatusTemplate({ loggedIn: false });
		else
			this.innerHTML = userStatusTemplate({ loggedIn: true, name: authData.selectedProfile.name });
		$(this).dropdown();
	}
}

customElements.define("user-status", UserStatus);

const changeCallback = () => {
	console.log("Auth store changed, rendering user status");
	document.querySelector<UserStatus>("user-status")?.render();
};
// @ts-ignore
AuthStore.onDidChange("selectedProfile.name", changeCallback);
AuthStore.onDidChange("loggedIn", changeCallback);
