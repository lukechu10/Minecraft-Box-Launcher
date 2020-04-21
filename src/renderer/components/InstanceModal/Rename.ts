import Instance from "../../Instance";
// import instanceRenameModalTemplate from "../../templates/modals/instances/Rename.pug";
import InstanceListStore from "../../store/InstanceListStore";
import { LitElement, customElement, property, html } from "lit-element";

@customElement("instance-rename-modal")
export default class Rename extends LitElement {
	createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;
	@property({ type: Boolean }) private isError: boolean = false;

	public render() {
		return html`
			<div class="header">Rename</div>
			<div class="content">
				<p>Enter a new name for instance <strong>${this.instance?.name}</strong></p>
				<div class="ui fluid input ${this.isError ? "error" : ""}">
					<input id="input-rename" type="text" name="newName" placeholder="New Name" value=${this.instance?.name ?? ""}>
				</div>
				${this.isError ? html`
					<div class="ui pointing red basic label">An instance with that name already exists</div>
				` : ""}
			</div>
			<div class="actions">
				<button class="ui button cancel blue">Cancel</button>
				<button class="ui button approve inverted green">Rename</button>
			</div>
		`;
	}

	public showModal(instance: Instance | null): void {
		this.isError = false;
		if (this.instance !== instance)
			this.instance = instance; // set new active instance
		else
			this.requestUpdate(); // update template with new data from instance

		// setup modal
		$(this).modal({
			closable: false,
			onApprove: () => {
				const input = this.querySelector<HTMLInputElement>("#input-rename");
				const newName = input?.value as string;
				const find = InstanceListStore.findInstanceName(newName); // make sure an instance with this name does not already exist
				if (find !== null) {
					this.isError = true;
					return false;
				}
				else {
					if (this.instance !== null) {
						this.instance.name = newName;
						InstanceListStore.syncToStore();
					}
				}
			}
		}).modal("show");
	}
}
