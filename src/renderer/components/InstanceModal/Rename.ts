import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type { Instance } from "../../Instance";
import InstanceListStore from "../../store/InstanceListStore";

@customElement("instance-rename-modal")
export default class Rename extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;
	@property({ type: Boolean }) private isError = false;
	@property({ type: String }) private errorMessage = "";

	protected render(): TemplateResult {
		return html`
			<div class="header">Rename</div>
			<div class="content">
				<p>Enter a new name for instance <strong>${this.instance?.name}</strong></p>
				<div class="ui fluid input ${this.isError ? "error" : ""}">
					<input id="input-rename" type="text" name="newName" placeholder="New Name" .value=${this.instance?.name ?? ""}>
				</div>
				${this.isError ? html`
					<div class="ui pointing red basic label">${this.errorMessage}</div>
				` : ""}
			</div>
			<div class="actions">
				<button class="ui button cancel blue">Cancel</button>
				<button class="ui button approve inverted green">Rename</button>
			</div>
		`;
	}

	private handleRename(): false | void {
		const input = this.querySelector<HTMLInputElement>("#input-rename")!;
		const newName = input.value;
		if (newName === "") {
			this.isError = true;
			this.errorMessage = "You must enter a name";
			return false;
		}
		const find = InstanceListStore.findInstanceName(newName); // make sure an instance with this name does not already exist
		if (find !== null) {
			this.isError = true;
			this.errorMessage = "An instance with that name already exists";
			return false;
		}
		else {
			this.instance!.name = newName;
			InstanceListStore.syncToStore();
		}
	}

	public async showModal(instance: Instance | null): Promise<void> {
		this.isError = false;
		this.errorMessage = "";

		this.instance = instance;
		await this.requestUpdate();

		// setup modal
		$(this).modal({
			closable: false,
			onApprove: this.handleRename
		}).modal("show");
	}
}
