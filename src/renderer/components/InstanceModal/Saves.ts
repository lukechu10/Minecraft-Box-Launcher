import Instance from "../../Instance";

// import components inside modal
import SavesTabServer from "./SavesTabServer";
import "./SavesTabServer";
import SavesTabWorld from "./SavesTabWorld";
import "./SavesTabWorld";
import { LitElement, customElement, html, property, TemplateResult } from "lit-element";

@customElement("instance-saves-modal")
export default class Saves extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) private instance: Instance | null = null;

	protected render(): TemplateResult {
		return html`
			<div class="header">Data</div>
			<div class="content">
				<div class="ui secondary menu">
					<a class="item" data-tab="worlds">Worlds</a>
					<a class="item" data-tab="servers">Servers</a>
				</div>
				<saves-tab-world class="ui tab segment" data-tab="worlds">
				</saves-tab-world>
				<saves-tab-server class="ui tab segment" data-tab="servers">
				</saves-tab-server>
			</div>
			<div class="actions">
				<button class="ui primary approve button">Close</button>
			</div>
		`;
	}

	public showModal(instance: Instance): void {
		this.instance = instance;
		// this.innerHTML = instanceSavesModalTemplate(instance);
		this.querySelector<SavesTabWorld>("saves-tab-world")!.setInstance(instance);
		this.querySelector<SavesTabServer>("saves-tab-server")!.setInstance(instance);

		$(this).modal({
			closable: false
		}).modal("show");

		$(this).find(".menu .item").tab({
			onLoad: (tabPath) => {
				if (tabPath === "worlds")
					this.querySelector<SavesTabWorld>("saves-tab-world")?.render();
				else if (tabPath === "servers")
					this.querySelector<SavesTabServer>("saves-tab-server")?.render();
			}
		});
	}
}
