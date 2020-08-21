import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-text-field";
import { customElement, html, LitElement, property, query, TemplateResult } from "lit-element";
import type { Instance } from "../../Instance";

@customElement("delete-page")
export class Delete extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;
	@property({ type: Boolean }) public showWarning = false;

	@query("#confirm-text-field")
	private confirmTextField!: HTMLInputElement;

	protected render(): TemplateResult {
		if (this.instance !== null) {
			return html`
				<div class="ui header">Delete</div>
				<p>
					This action is irreversible.<br>
					If you are sure you want to delete this game instance, enter the name of this instance (<strong>${this.instance.name}</strong>) in the text box below.
				</p>
				<vaadin-text-field id="confirm-text-field" style="width: 100%;" required pattern=${this.instance.name} placeholder=${this.instance.name}></vaadin-text-field>
				<vaadin-checkbox value="Option" checked>Delete instance folder</vaadin-checkbox>
				<vaadin-button id="delete-button" theme="error primary" @click=${this.deleteButtonClick}>Delete Instance</vaadin-button>
				${this.showWarning ? html`<p id="confirm-message" style="color: red;"><strong>You must enter the name of the instance in the text box.</strong></p>`: html``}
			`;
		}
		else {
			return html``;
		}
	}

	private deleteButtonClick(): void {
		if (this.confirmTextField.value !== this.instance!.name) {
			this.showWarning = true;
		}
	}
}
