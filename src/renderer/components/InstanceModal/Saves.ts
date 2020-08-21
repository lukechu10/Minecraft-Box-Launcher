import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type { Instance } from "../../Instance";

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
				<saves-tab-world class="ui tab segment" data-tab="worlds" .instance=${this.instance}>
				</saves-tab-world>
				<saves-tab-server class="ui tab segment" data-tab="servers" .instance=${this.instance}>
				</saves-tab-server>
			</div>
			<div class="actions">
				<button class="ui primary approve button">Close</button>
			</div>
		`;
	}

	public async showModal(instance: Instance): Promise<void> {
		// import components inside modal
		await import(/* webpackChunkName: "SavesTabServer" */ "./SavesTabServer");
		await import(/* webpackChunkName: "SavesTabWorld" */ "./SavesTabWorld");
		this.instance = instance;
		await this.requestUpdate();

		$(this).modal({
			closable: false
		}).modal("show");

		$(this).find(".menu .item").tab("change tab", "worlds");
	}
}
