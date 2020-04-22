import { LitElement, customElement, property, html } from "lit-element";
import Instance from "../../Instance";

@customElement("instance-delete-modal")
export default class ConfirmDelete extends LitElement {
	createRenderRoot(): this { return this; }

	@property({ type: Object }) private instance: Instance | null = null;

	protected render() {
		// this.innerHTML = instanceDeleteModalTemplate(instance);
		return html`
			<div class="header">Are you sure?</div>
			<div class="content">
				<p>
					Are you sure you want to delete the instance <strong>${this.instance?.name}</strong>
				</p>
				<div class="ui checkbox">
					<input type="checkbox" name="deleteFolder" checked>
					<label style="color: white;">
						Delete the instance folder. <strong>IMPORTANT</strong>: This will delete all your worlds and other resources in this instance.
					</label>
				</div>
			</div>
			<div class="actions">
				<button class="ui button cancel inverted basic blue">Cancel</button>
				<button class="ui button approve inverted red" @click=${this.handleDelete}>Delete it</button>
			</div>
		`;
	}

	private handleDelete(): boolean | void {
		const deleteFolder: boolean = document.querySelector<HTMLInputElement>("#modal-confirmDelete input[name='deleteFolder']")!.checked;
		this.instance!.delete(deleteFolder);
	}

	public async showModal(instance: Instance | null): Promise<void> {
		this.instance = instance;
		await this.requestUpdate();

		$(this).modal({
			closable: false
		}).modal("show");
	}
}
