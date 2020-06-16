import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("quick-info-page")
export class QuickInfoPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	protected render(): TemplateResult {
		import("./UnsavedDataWarning");
		return html`
			<div class="ui inverted header">Quick Info</div>
			<unsaved-data-warning></unsaved-data-warning>
		`;
	}
}
