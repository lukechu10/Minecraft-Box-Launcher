import template from "../../templates/HomeComponents/Account.pug";

class Account extends HTMLElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		this.innerHTML = template();
	}
}

customElements.define("home-account", Account);
