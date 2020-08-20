import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("advanced-options-page")
export class AdvancedOptionsPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	protected render(): TemplateResult {
		return html`
			<div class="ui header">Advanced Options</div>
			<p>Comming soon</p>
		`;
	}
}
