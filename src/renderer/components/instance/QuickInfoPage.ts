import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("quick-info-page")
export class QuickInfoPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	protected render(): TemplateResult {
		import("./UnsavedDataWarning");
		return html`
			<unsaved-data-warning id="QuickInfoPage-unsavedDataWarning" @saved=${this.handleSave} @discarded=${this.handleDiscard}></unsaved-data-warning>
			<div class="ui inverted header">Quick Info</div>	
		`;
	}

	private handleSave() {
		console.log("saved");
		this.toggleUnsavedDataWarning();
	}

	private handleDiscard() {
		console.log("discarded");
		this.toggleUnsavedDataWarning();
	}

	private toggleUnsavedDataWarning() {
		$("#QuickInfoPage-unsavedDataWarning").transition("fade left");
	}
}
