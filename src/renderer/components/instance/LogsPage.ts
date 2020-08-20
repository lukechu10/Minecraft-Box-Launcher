import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("logs-page")
export class LogsPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;

	protected render(): TemplateResult {
		if (this.instance !== null) {
			return html`
				<div class="ui header">Logs</div>
				<p>Comming soon</p>
			`;
		}
		else {
			return html``;
		}
	}
}
