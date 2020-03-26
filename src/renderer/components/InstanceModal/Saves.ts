import Instance from "../../Instance";
import instanceSavesModalTemplate from "../../templates/modals/instances/Saves.pug";

// import components inside modal
import SavesTabServer from "./SavesTabServer";
import "./SavesTabServer";

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

		$(this).find(".menu .item").tab({
			onLoad: (tabPath) => {
				if (tabPath === "servers") this.querySelector<SavesTabServer>(".ui.tab[is='saves-tab-server']")?.render();
			}
		});

		this.querySelector<SavesTabServer>(".ui.tab[is='saves-tab-server']")?.setInstance(instance);
	}
}

customElements.define("instance-saves-modal", Saves, { extends: "div" });
