import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("saves-page")
export class SavesPages extends LitElement {
	protected createRenderRoot(): this { return this; }

	protected render(): TemplateResult {
		return html`
			<div class="ui header">Saves</div>	
		`;
	}
}
