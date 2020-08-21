import { customElement, html, LitElement, TemplateResult } from "lit-element";

@customElement("advanced-options-page")
export class AdvancedOptionsPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	protected render(): TemplateResult {
		return html`
			<div class="ui header">Advanced Options</div>
			<p>Coming soon</p>
		`;
	}
}
