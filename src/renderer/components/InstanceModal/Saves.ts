import Instance from "../../Instance";
import instanceSavesModalTemplate from "../../templates/modals/instances/Saves.pug";


export default class Saves extends HTMLDivElement {
	instance: Instance | null = null;
	public constructor() {
		super();
	}
	public connectedCallback(): void { }
	public render(instance: Instance): void {
		this.instance = instance;
		this.innerHTML = instanceSavesModalTemplate(instance);
		$(this).modal({
			closable: false
		}).modal("show");
	}
}

customElements.define("instance-saves-modal", Saves, { extends: "div" });
