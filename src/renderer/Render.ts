import { instances } from "../universal/store";
import InstanceSave from "./instance/InstanceSave";
import * as instancesController from "./instance";
import { store } from "./global";

declare function instancelistTemplate(data: any): string;
/**
 * Renders instance list on instance page
 */
export function instanceList(): void {
	$("#instance-list").html(instancelistTemplate({ data: instances.all }));
	$(".ui.dropdown").dropdown();
	return;
}

// attach event handlers
$(document).on("click", "#btn-install", e => {
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// install by name
	instancesController.installByName(name);
	// update text
	// TODO: add as member to InstanceSave to save text when switching pages
	$(e.currentTarget).text("Installing...").removeClass("olive").attr("id", "").addClass(["gray", "disabled"]);
}).on("click", "#btn-play", e => {
	// launch by name
});