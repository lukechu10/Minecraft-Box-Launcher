import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

@customElement("unsaved-data-warning")
export class UnsavedDataWarning extends LitElement {
	protected createRenderRoot(): this { return this; }

	protected render(): TemplateResult {
		return html`
			<div class="ui inverted raised clearing segment">
				<span class="ui left floated" style="display: inline-block;">You have unsaved changes</span>
				<button class="ui compact right floated button" @click=${this.handleDiscard}>Discard</button>
				<button class="ui compact primary right floated button" @click=${this.handleSave}>Save</button>
			</div>
		`;
	}

	private handleSave() {
		const saveEvent = new CustomEvent("saved", {
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(saveEvent);
	}

	private handleDiscard() {
		const discardEvent = new CustomEvent("discarded", {
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(discardEvent);
	}
}
