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
