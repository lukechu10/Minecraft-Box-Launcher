import Instance from "../../Instance";
// import instanceRenameModalTemplate from "../../templates/modals/instances/Rename.pug";
import InstanceListStore from "../../store/InstanceListStore";
import { LitElement, customElement, property, html } from "lit-element";

@customElement("instance-rename-modal")
export default class Rename extends LitElement {
	createRenderRoot(): this { return this; }

	@property({ type: Object }) instance: Instance | null = null;

	public render() {
		return html`
			<div class="header">Rename</div>
			<div class="content">
				<p>Enter a new name for instance ${this.instance?.name}</p>
				<div class="ui fluid input">
					<input id="input-rename" type="text" name="newName" placeholder="New Name" value=${this.instance?.name ?? ""}>
				</div>
			</div>
			<div class="actions">
				<button class="ui button cancel blue">Cancel</button>
				<button class="ui button approve inverted green">Rename</button>
			</div>
		`;
	}

	public showModal(instance: Instance | null): void {
		if (this.instance !== instance)
			this.instance = instance; // set new active instance
		else
			this.requestUpdate(); // update template with new data from instance
		$(this).modal({
			closable: false,
			onApprove: () => {
				const find = InstanceListStore.findInstanceName($("#input-rename").val() as string); // make sure an instance with this name does not already exist
				if (find !== null) {
					alert("An instance with this name already exists"); // TODO: Change to modal to match rest of UI
					return false;
				}
				else {
					if (this.instance !== null) {
						this.instance.name = $("#input-rename").val() as string;
						InstanceListStore.syncToStore();
					}
				}
			}
		}).modal("show");
	}
}
