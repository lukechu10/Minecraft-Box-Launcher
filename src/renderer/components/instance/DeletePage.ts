import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-text-field";
import { customElement, html, LitElement, property, query, TemplateResult } from "lit-element";
import type { Instance } from "../../Instance";

@customElement("delete-page")
export class Delete extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;
	@property({ type: Boolean }) private enableDeleteButton = false;

	@query("#delete-folder-checkbox") private deleteFolderCheckbox!: HTMLInputElement;

	protected render(): TemplateResult {
		if (this.instance !== null) {
			return html`
				<div class="ui header">Delete</div>
				<p>
					This action is irreversible.<br>
					If you are sure you want to delete this game instance, enter the name of this instance (<strong>${this.instance.name}</strong>) in the text box below.
				</p>
				<vaadin-text-field id="confirm-text-field" style="width: 100%;" required pattern=${this.instance.name} placeholder=${this.instance.name}
				@input=${this.confirmTextFieldChange}></vaadin-text-field>
				
				<vaadin-checkbox id="delete-folder-checkbox" value="Option" checked>Delete instance folder</vaadin-checkbox>
				<vaadin-button id="delete-button" theme="error primary" @click=${this.deleteButtonClick} ?disabled=${!this.enableDeleteButton}>Delete Instance</vaadin-button>
			`;
		}
		else {
			return html``;
		}
	}

	private deleteButtonClick(): void {
		const deleteFolder = this.deleteFolderCheckbox.checked;
		this.instance!.delete(deleteFolder);
		const deletedEvent = new CustomEvent("deleted", {
			bubbles: true,
			composed: true
		});

		this.dispatchEvent(deletedEvent);
	}

	private confirmTextFieldChange(e: InputEvent): void {
		this.enableDeleteButton = (e.target as HTMLInputElement).value === this.instance!.name;
	}
}
