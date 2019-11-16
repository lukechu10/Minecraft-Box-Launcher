import { instances } from "../universal/store";
import InstanceSave from "./instance/InstanceSave";
import { store } from "./global";
import { InstanceController } from "./controllers/InstanceController";

import { ipcRenderer } from "electron";

export namespace Render {
	declare function instancelistTemplate(data: any): string;
	/**
	 * Renders instance list on instance page
	 */
	export function instanceList(): void {
		$("#instance-list").html(instancelistTemplate({ data: instances.all }));
		$(".ui.dropdown").dropdown();
		return;
	}
	/**
	 * Shows new instance page
	 */
	export function newInstance() {
		ipcRenderer.sendSync("show-window", "newInstance");
	}
}

// attach event handlers
$(document).on("click", "#btn-install", e => {
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// install by name
	InstanceController.installByName(name);
	// update text
	// TODO: add as member to InstanceSave to save text when switching pages
	$(e.currentTarget).text("Installing...").removeClass("olive").attr("id", "").addClass(["gray", "disabled"]);
}).on("click", "#btn-play", e => {
	const name: string = $(e.currentTarget).attr("data-instance-name") as string;
	// launch by name
	InstanceController.launch(name);
});