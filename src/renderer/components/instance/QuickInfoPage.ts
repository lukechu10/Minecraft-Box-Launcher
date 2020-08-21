import "@vaadin/vaadin-text-field";
import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { live } from "lit-html/directives/live";
import type Instance from "../../Instance";

@customElement("quick-info-page")
export class QuickInfoPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;

	protected render(): TemplateResult {
		if (this.instance !== null) {
			return html`
				<div class="ui header">Quick Info</div>
				<vaadin-text-field label="Instance Name" .value=${live(this.instance.name)} @input=${this.instanceNameChanged}></vaadin-text-field>
			`;
		}
		else {
			return html``;
		}
	}

	private instanceNameChanged(event: InputEvent): void {
		this.instance!.name = (event.target as HTMLInputElement).value;
		this.dispatchChangedEvent();
	}

	private dispatchChangedEvent(): void {
		const instanceChangedEvent = new CustomEvent("instanceChanged", {
			bubbles: true,
			composed: true
		});
		
		this.dispatchEvent(instanceChangedEvent);
	}
}
