import Instance from "../../Instance";
import instanceOptionsModalTemplate from "../../templates/modals/instances/Options.pug";
import InstanceListStore from "../../store/InstanceListStore";

export default class Options extends HTMLDivElement {
	private instance: Instance | null = null;
	private oldName: string = "";
	public constructor() {
		super();
	}
	public connectedCallback(): void { }
	public render(instance: Instance): void {
		this.instance = Object.assign({}, instance); // deep copy
		this.oldName = instance.name;
		this.innerHTML = instanceOptionsModalTemplate(this.instance);
		$(this).modal("show");
		this.attachEvents();
	}

	private attachEvents(): void {
		$("#modal-options input").on("input", e => {
			if (this.instance !== null) {
				// TODO: Update modal
				$("#btn-modalOptionsSave").removeClass("disabled");
				switch (e.currentTarget.getAttribute("name")) {
					case "instance-name":
						this.instance.name = (e.currentTarget as HTMLInputElement).value;
				}
			}
		});

		if ($.fn.form.settings.rules !== undefined) {
			$.fn.form.settings.rules.doesNotExist = (param): boolean => {
				const find = InstanceListStore.findInstanceName(param);
				return param.length === 0 || find === null;
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
			if ($form.form("is valid") && this.instance !== null) {
				InstanceListStore.modifyInstance(this.oldName, this.instance); // update store
				InstanceListStore.syncToStore();
				return true;
			}
			else return false; // prevent close action
		});
	}
}

customElements.define("instance-options-modal", Options, { extends: "div" });
