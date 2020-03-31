import Instance from "../../Instance";
import instanceSavesModalTemplate from "../../templates/modals/instances/Saves.pug";

// import components inside modal
import SavesTabServer from "./SavesTabServer";
import "./SavesTabServer";
import SavesTabWorld from "./SavesTabWorld";
import "./SavesTabWorld";

export default class Saves extends HTMLDivElement {
	instance: Instance | null = null;
	public constructor() {
		super();
	}
	public connectedCallback(): void { }
	public render(instance: Instance): void {
		this.instance = instance;
		this.innerHTML = instanceSavesModalTemplate(instance);

		this.querySelector<SavesTabServer>(".ui.tab[is='saves-tab-server']")?.setInstance(instance);
		this.querySelector<SavesTabWorld>(".ui.tab[is='saves-tab-world']")?.setInstance(instance);

		$(this).modal({
			closable: false
		}).modal("show");

		$(this).find(".menu .item").tab({
			onLoad: (tabPath) => {
				if (tabPath === "servers") this.querySelector<SavesTabServer>(".ui.tab[is='saves-tab-server']")?.render();
				else if (tabPath === "worlds") this.querySelector<SavesTabWorld>(".ui.tab[is='saves-tab-world']")?.render();
			}
		});
	}
}

customElements.define("instance-saves-modal", Saves, { extends: "div" });
