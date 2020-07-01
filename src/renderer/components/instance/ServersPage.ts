import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("servers-page")
export class ServersPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	protected render(): TemplateResult {
		return html`
			<div class="ui inverted header">Servers</div>	
		`;
	}
}
