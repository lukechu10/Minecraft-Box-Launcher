import { ApplicationStore } from "./store";
import { InstanceController } from "./controllers/InstanceController";

// import instance modal templates
import corruptedModal from "./templates/modals/instances/corrupted.pug";

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
$(document).on("click", ".btn-play", e => {
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
