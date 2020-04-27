import newInstanceModalTemplate from "../templates/NewInstanceModal.pug";
import { InstanceData } from "../store/InstanceData";
import { ApplicationStore } from "../store";
import { Installer } from "@xmcl/installer";
import InstanceListStore from "../store/InstanceListStore";
import Instance from "../Instance";

import { v4 as uuidv4 } from "uuid";

export default class NewInstanceModal extends HTMLDivElement {
	public render(): void {
		this.innerHTML = newInstanceModalTemplate();
		$(this).modal("show");
		this.attachEvents();
	}
	public attachEvents(): void {
		// setup dropdowns
		$(".ui.dropdown#dropdown-type").dropdown();
		(document.getElementById("dropdown-type") as HTMLInputElement).addEventListener("change", () => {
			this.updateIdDropdown($("#form-newInstance").form("get value", "instance-type"));
		});
		document.getElementById("submit-newInstanceForm")?.addEventListener("click", (e: MouseEvent) => {
			e.preventDefault();
			const $form = $("#form-newInstance");
			$form.form("validate form");
			if ($form.form("is valid")) {
				// create new instance from input values
				const tmpInstance: InstanceData = {
					name: $form.form("get value", "instance-name"),
					...this.getVersionMeta($form.form("get value", "instance-id")) as Installer.Version,
					lastPlayed: "never",
					installed: false,
					clientType: "vanilla",
					uuid: uuidv4(),
					isInstalling: false
				};
				// save instance to store
				InstanceListStore.instances.push(new Instance(tmpInstance));
				InstanceListStore.syncToStore(); // save to store
				$(this).modal("hide"); // close modal
			}
		});

		if ($.fn.form.settings.rules !== undefined) {
			$.fn.form.settings.rules.doesNotExist = (param): boolean => {
				const find = InstanceListStore.findInstanceName(param);
				return param.length !== 0 && find === null;
			};
		}
		// setup form
		$("#form-newInstance").form({
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
				},
				type: {
					identifier: "instance-type",
					rules: [{
						type: "empty",
						prompt: "Please select a type for the instance"
					}]
				},
				id: { // minecraft version
					identifier: "instance-id",
					rules: [{
						type: "empty",
						prompt: "Please select a version for the instance"
					}]
				}
			}
		});
	}
	private getVersionMeta(id: string): Installer.Version | undefined {
		return (ApplicationStore.versionsMetaCache.get("versions") as Installer.Version[]).find(obj => obj.id === id);
	}

	private updateIdDropdown(val?: string): void {
		$("#dropdown-id .menu").empty();
		$("#dropdown-id").dropdown("set text", "Select Version");
		// check if version is selected
		if (val !== undefined) {
			// remove disable on #dropdown-id
			$(".ui.dropdown#dropdown-id").removeClass("disabled");
			// find list of instances
			const versions = ApplicationStore.versionsMetaCache.get("versions") as Installer.Version[];
			// append to dropdown
			switch (val) {
				case "vanilla-release":
					for (const version of versions) {
						if (version.type == "release") {
							// render versions
							$("#dropdown-id .menu").append(this.menuItem(version));
						}
					}
					break;
				case "vanilla-snapshot":
					for (const version of versions) {
						if (version.type == "snapshot") {
							// render versions
							$("#dropdown-id .menu").append(this.menuItem(version));
						}
					}
					break;
				case "vanilla-historical":
					for (const version of versions) {
						if (version.type == "old_alpha" || version.type == "old_beta") {
							// render versions
							$("#dropdown-id .menu").append(this.menuItem(version));
						}
					}
					break;
				case "forge":
					break;
			}
		}
		else
			$(".ui.dropdown#dropdown-id").addClass("disabled");
	}
	// TODO: change to pug template
	private menuItem(version: Installer.Version): string {
		return `<div class="item" data-value="${version.id}">
	<div class="text" style="display:inline-block">${version.id}</div>
	<div class="description">${version.releaseTime}</div>
	</div>`;
	}
}

customElements.define("modal-new-instance", NewInstanceModal, { extends: "div" });
