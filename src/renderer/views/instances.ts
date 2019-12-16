import { ApplicationStore } from "../../universal/store";
// templates
import instancelistTemplate from "../templates/instanceList.pug";

/**
 * Renders instance list on instance page
 */
export function instanceList(): void {
	$("#instance-list").html(instancelistTemplate({ data: ApplicationStore.instances.all }));
	$(".ui.dropdown").dropdown();
	return;
}
