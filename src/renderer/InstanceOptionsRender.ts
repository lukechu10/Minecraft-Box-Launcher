import optionsModal from "./templates/modals/instances/options.pug";
import { ApplicationStore } from "./store";
import * as Render from "./Render";
import { InstanceSave } from "./store/InstanceSave";

declare let instanceOptionsName: string;
declare let instanceOptionsTemp: InstanceSave;

/**
 * Event handlers for options modal
 */
function attachEvents(): void {
	$("#modal-options input").one("input", () => {
		// TODO: Update modal
		$("#btn-modalOptionsSave").removeClass("disabled");
	});

	if ($.fn.form.settings.rules !== undefined) {
		$.fn.form.settings.rules.doesNotExist = (param): boolean => {
			// Your validation condition goes here
			const find = ApplicationStore.instances.findFromName(param);
			console.log(find);
			return param.length !== 0 && find === undefined;
		};
	}

	$("#form-options").form({
		inline: true,
		fields: {
			name: {
				identifier: "instance-name",
				rules: [{
					type: "doesNotExist",
					prompt: ((value: string) => {
						if (value.length === 0) return "Please enter a name for this instance";
						else return "An instance with this name already exists"; // can only be invalid if not blank
					}) as unknown as string // FIXME: This is a bug with semantic-ui typings where validating programmatically is not working
				}]
			}
		}
	}).submit(event => {
		event.preventDefault(); // default is page reload
	});
	// submit button
	$("#btn-modalOptionsSave").on("click", (): boolean => {
		const $form = $("#form-options");
		$form.form("validate form");
		if ($form.form("is valid")) {
			console.log(instanceOptionsName);
			ApplicationStore.instances.setInstance(instanceOptionsName, instanceOptionsTemp); // update store
			Render.instanceList(); // update instance list
			return true;
		}
		else return false; // prevent close action
	});
}

/**
 * Shows options modal for an instance
 * @param name name of instance
 */
export function showOptionsForInstance(name: string): void {
	$("#modal-options").replaceWith(optionsModal({ name }));
	$("#modal-options").modal({
		closable: false
	}).modal("show");
	// attach event handlers
	attachEvents();
}
