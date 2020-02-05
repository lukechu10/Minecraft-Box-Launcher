import { ApplicationStore } from "../store";
import { InstanceData } from "../store/InstanceData";
import { InstanceController } from "../controllers/InstanceController";

// import instance modal templates
import renameModalTemplate from "../templates/modals/instances/rename.pug";
import corruptedModalTemplate from "../templates/modals/instances/corrupted.pug";
import savesModalTemplate from "../templates/modals/instances/saves.pug";
import confirmDeleteModalTemplate from "../templates/modals/instances/confirmDelete.pug";
import instanceItemTemplate from "../templates/InstanceItem.pug"; // important item template

export default class InstanceItem extends HTMLDivElement {
	public instanceData: InstanceData;

	public constructor(data: InstanceData) {
		super();
		this.instanceData = data;
	}

	public render(): void {
		// this.instanceData = data;
		this.innerHTML = instanceItemTemplate({ data: this.instanceData }); // render template
		$(this).find(".ui.dropdown").dropdown(); // attach FUI dropdown handler

		// attach event handlers
		(this.getElementsByClassName("btn-rename")[0] as HTMLDivElement).addEventListener("click", () => {
			this.rename();
		});
	}

	/**
	 * Shows a rename modal and handles user input
	 */
	public rename(): void {
		const renameModal = document.getElementById("modal-rename");
		if (renameModal !== null) {
			renameModal.outerHTML = renameModalTemplate({ name: this.instanceData?.name });
			$("#modal-rename").modal({
				closable: false,
				onApprove: () => {
					const find = ApplicationStore.instances.findFromName($("#input-rename").val() as string); // make sure an instance with this name does not already exist
					if (find !== undefined) {
						alert("An instance with this name already exists"); // TODO: Change to modal to match rest of UI
						return false;
					}
					else
						InstanceController.renameInstance(this.instanceData.name, $("#input-rename").val() as string);
				}
			}).modal("show");
		}
	}
}

customElements.define("instance-item", InstanceItem, { extends: "div" });
