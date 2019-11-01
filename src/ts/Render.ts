import { instances } from "./store";

declare function instancelistTemplate(data: any): string;
/**
 * Renders instance list on instance page
 */
export function instanceList(): void {
	$("#instance-list").html(instancelistTemplate({ data: instances.all }));
	$(".ui.dropdown").dropdown();
	return;
}
