import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("mods-page")
export class ModsPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;

	protected render(): TemplateResult {
		if (this.instance !== null) {
			return html`
				<div class="ui header">Mods</div>
				<p>Coming soon</p>
			`;
		}
		else {
			return html``;
		}
	}
}
