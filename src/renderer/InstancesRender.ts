import { ApplicationStore } from "./store";
import { InstanceController } from "./controllers/InstanceController";

// import instance modal templates
import renameModal from "./templates/modals/instances/rename.pug";
import corruptedModal from "./templates/modals/instances/corrupted.pug";
import savesModal from "./templates/modals/instances/saves.pug";
import confirmDeleteModal from "./templates/modals/instances/confirmDelete.pug";

/**
 * Show instance is corrupted modal
 */
export function showCorruptedModal({ name, onApprove, onDeny }: { name: string, onApprove: () => false | void, onDeny: () => false | void }): void {
	$("#modal-corrupted").replaceWith(corruptedModal({ name }));
	$("#modal-corrupted").modal({
		closable: false,
		onApprove,
		onDeny
	}).modal("show");
}

// attach event handlers
$(document).on("click", ".btn-install", e => {
	// install instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// install by name
	InstanceController.installByName(name);
	// update text
	// TODO: add as member to InstanceSave to save text when switching pages
	$(e.currentTarget).text("Installing...").removeClass("olive").attr("id", "").addClass(["gray", "disabled"]);
}).on("click", ".btn-reinstall", e => {
	// install instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// install by name
	InstanceController.installByName(name);
	// update text
	// TODO: add as member to InstanceSave to save text when switching pages
	$(`.btn-play[data-instance-name="${name}"]`).text("Installing...").removeClass("green").attr("id", "").addClass(["gray", "disabled"]);
}).on("click", ".btn-play", e => {
	// launch instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// launch by name
	const instance = ApplicationStore.instances.findFromName(name);
	if (instance !== undefined) {
		instance.launch();
		// last played should be updated, save to store
		ApplicationStore.instances.setInstance(name, instance);
	}
	else throw Error("The instance requested does not exist");
});
