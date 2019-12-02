import { remote, ipcRenderer } from "electron";
import { ApplicationStore } from "../../universal/store";
import { InstanceSave } from "../../universal/store/InstanceSave";
// load data from store
declare let instanceName: string;
export let instanceData: InstanceSave = ApplicationStore.instances.findFromName(instanceName) as InstanceSave;

/**
 * Save modified data to instance store
 * @returns `true` success and `false` if error
 */
export function saveInstanceData(): boolean {
	const find = ApplicationStore.instances.findFromName(instanceData.name); // make sure an instance with this name does not already exist
	if (find !== undefined) {
		alert("An instance with this name already exists"); // TODO: Change to modal to match rest of UI
		return false;
	}
	ApplicationStore.instances.setInstance(instanceName, instanceData);
	return true;
}

/**
 * Refresh event handlers. Should be called when changing pages
 */
export function refreshEventHandlers(): void {
	$("#button-saveOptions").addClass("disabled");
	$("form :input").on("change", () => {
		// enable save button
		$("#button-saveOptions").removeClass("disabled");
	});
}
// form on change
$(() => {
	// save event
	$("#button-saveOptions").on("click", () => {
		if (saveInstanceData()) {
			ipcRenderer.sendSync("new-instance");
			// save data from form
			remote.getCurrentWindow().close(); // close window
		}
	});
});
