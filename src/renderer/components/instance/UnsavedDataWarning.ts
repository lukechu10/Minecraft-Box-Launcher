import { css, customElement, html, LitElement, TemplateResult } from "lit-element";
import "@vaadin/vaadin-button";

@customElement("unsaved-data-warning")
export class UnsavedDataWarning extends LitElement {
	public static styles = css`
		:host {
			background-color: rgb(54, 54, 54);
			border-radius: 0.25em;
			padding: 0 10px;
		}

		span {
			display: inline-block;
			color: white;
		}

		#save-button {
			margin-left: 10px;
		}
	`;

	protected render(): TemplateResult {
		return html`
			<span>You have unsaved changes</span>
			<vaadin-button id="save-button" theme="success primary" @click=${this.handleSave}>Save</vaadin-button>
			<vaadin-button id="discard-button" theme="error" @click=${this.handleDiscard}>Discard</vaadin-button>
		`;
	}

	private handleSave(): void {
		const saveEvent = new CustomEvent("saved", {
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(saveEvent);
	}

	private handleDiscard(): void {
		const discardEvent = new CustomEvent("discarded", {
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(discardEvent);
	}
}
