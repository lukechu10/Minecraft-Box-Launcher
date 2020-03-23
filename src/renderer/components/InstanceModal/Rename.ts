import Instance from "../../Instance";
import instanceRenameModalTemplate from "../../templates/modals/instances/Rename.pug";
import InstanceListStore from "../../store/InstanceListStore";

export default class Rename extends HTMLDivElement {
	private instance: Instance | null = null;
	private oldName: string = "";
	public constructor() {
		super();
	}
	public connectedCallback(): void { }
	public render(instance: Instance): void {
		this.instance = instance;
		this.oldName = instance.name;
		this.innerHTML = instanceRenameModalTemplate(this.instance);
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
						InstanceListStore.modifyInstance(this.oldName, instance);
						InstanceListStore.syncToStore();
					}
				}
			}
		}).modal("show");
	}
}

customElements.define("instance-rename-modal", Rename, { extends: "div" });
