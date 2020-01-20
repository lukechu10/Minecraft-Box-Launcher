import settingsTemplate from "../templates/modals/settings.pug";
import { GlobalSettings } from "../store/GlobalSettingsStore";
import { ApplicationStore } from "../store";

export function showSettingsModal() {
	$("#modal-settings").replaceWith(settingsTemplate(ApplicationStore.GlobalSettings.store));
	$("#modal-settings").modal({
		closable: false,
		onApprove: () => {
			const $form = $("#form-settings");
			// store data from form into store
			const settings: GlobalSettings = {
				java: {
					externalJavaPath: $form.form("get value", "java-path")
				}
			};
			ApplicationStore.GlobalSettings.set(settings); // save settings
		},
		onDeny: () => {
			// throw away form data
		}
	}).modal("show");
}
