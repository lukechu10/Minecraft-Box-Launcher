import { ApplicationStore } from "../universal/store";
import { InstanceController } from "./controllers/InstanceController";
import { LaunchController } from "./controllers/LaunchController";
import * as InstanceOptionsController from "./InstanceOptionsRender"; // FIXME: should be wrapped in namespace
// import templates
import instancelistTemplate from "./templates/instanceList.pug";

// import instance modal templates
import renameModal from "./templates/modals/instances/rename.pug";
import corruptedModal from "./templates/modals/instances/corrupted.pug";
import savesModal from "./templates/modals/instances/saves.pug";
import confirmDeleteModal from "./templates/modals/instances/confirmDelete.pug";


/**
 * Renders instance list on instance page
 */
export function instanceList(): void {
	$("#instance-list").html(instancelistTemplate({ data: ApplicationStore.instances.all }));
	$(".ui.dropdown").dropdown();
	return;
}

/**
 * Renders and shows the confirm delete modal
 * @param opts arguments to pass to pugjs
 */
export function instanceConfirmDelete({ name, onApprove, onDeny }: { name: string, onApprove: () => false | void, onDeny: () => false | void }): void {
	$("#modal-confirmDelete").replaceWith(confirmDeleteModal({ name }));
	// show modal
	$("#modal-confirmDelete").modal({
		closable: false,
		onApprove,
		onDeny
	}).modal("show");
}


/**
 * Show saves modal
 */
export function showSavesModal(name: string): void {
	$("#modal-saves").replaceWith(savesModal({ name }));
	$("#modal-saves").modal({
		closable: false
	}).modal("show");
}


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


/**
 * Show rename modal
 */
export function showRenameModal({ name, onApprove, onDeny }: { name: string, onApprove: () => false | void, onDeny: () => false | void }): void {
	$("#modal-rename").replaceWith($(renameModal({ name })));
	$("#modal-rename").modal({
		closable: false,
		onApprove,
		onDeny
	}).modal("show");
}

/**
 * Shows instance options modal
 * @param name name of instance
 */
export function instanceOptions(name: string): void {
	InstanceOptionsController.showOptionsForInstance(name);
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
	$(`.btn-play[data-instance-name=${name}]`).text("Installing...").removeClass("green").attr("id", "").addClass(["gray", "disabled"]);
}).on("click", ".btn-play", e => {
	// launch instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// launch by name
	LaunchController.launch(name);
}).on("click", ".btn-delete", e => {
	// delete instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// show prompt
	instanceConfirmDelete({
		name,
		onApprove: () => {
			// delete instance
			const deleteFolder: boolean = $("#modal-confirmDelete input[name='deleteFolder']").is(":checked");
			InstanceController.deleteInstance(name, deleteFolder);
		},
		onDeny: () => {
			// close modal
		}
	});
}).on("click", ".btn-rename", e => {
	// rename instance
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	showRenameModal({
		name,
		onApprove: () => {
			const find = ApplicationStore.instances.findFromName($("#input-rename").val() as string); // make sure an instance with this name does not already exist
			if (find !== undefined) {
				alert("An instance with this name already exists"); // TODO: Change to modal to match rest of UI FIXME: Clicking on OK in alert removes focus from input. No longer able to focus on input unless the window is unfocused and focused again
				return false;
			}
			else
				InstanceController.renameInstance(name, $("#input-rename").val() as string);
		},
		onDeny: () => {
			// close modal
		}
	});
}).on("click", ".btn-options", e => {
	// open options window
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	instanceOptions(name);
}).on("click", ".btn-saves", e => {
	// open saves window
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	showSavesModal(name);
});
