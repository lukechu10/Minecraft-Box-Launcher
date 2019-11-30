import { remote, ipcRenderer } from "electron";
import { ApplicationStore } from "../../universal/store";
import { InstanceSave } from "../../universal/store/InstanceSave";
// load data from store
declare let instanceName: string;
export let instanceData: InstanceSave = ApplicationStore.instances.findFromName(instanceName) as InstanceSave;

/**
 * Save modified data to instance store
 */
export function saveInstanceData(): void {
	ApplicationStore.instances.setInstance(instanceName, instanceData);
	return;
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
		saveInstanceData();
		ipcRenderer.sendSync("new-instance");
		// save data from form
		remote.getCurrentWindow().close(); // close window
	});
});
