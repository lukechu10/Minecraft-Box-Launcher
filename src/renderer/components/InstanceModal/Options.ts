import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type { Instance } from "../../Instance";
import InstanceListStore from "../../store/InstanceListStore";

@customElement("instance-options-modal")
export default class Options extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) private instanceRef: Instance | null = null;
	@property({ type: Object }) private instance: Instance | null = null;
	@property({ type: Boolean }) private canSave = false;

	protected render(): TemplateResult {
		if (this.instanceRef === null) {
			return html``;
		}
		else {
			return html`
				<div class="header">${this.instanceRef.name} | Options</div>
				<div class="content">
					<div class="ui center aligned header">Instance</div>
					<form class="ui form" id="form-options">
						<div class="field">
							<label>Name</label>
							<input class="ui input" name="instance-name" .value="${this.instanceRef.name}" @input="${this.handleInput}">
						</div>
					</form>
				</div>
				<div class="actions">
					<button class="ui primary approve button" ?disabled="${!this.canSave}">Save and close</button>
					<button class="ui deny button">Cancel</button>
				</div>
			`;
		}
	}

	public async showModal(instance: Instance): Promise<void> {
		this.instanceRef = instance;
		this.instance = Object.assign({}, instance); // create a deep copy of instance
		this.canSave = false;
		await this.requestUpdate();

		// remove all error fields from form
		this.querySelectorAll(".error").forEach(elem => elem.classList.remove("error"));
		this.querySelectorAll(".red.pointing.label").forEach(elem => elem.remove());

		$.fn.form.settings.rules!.doesNotExist = (param): boolean => {
			const find = InstanceListStore.findInstanceName(param);
			return param.length === 0 || find === null;
		};

		// setup form
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

		$(this).modal({
			onApprove: (): false | void => {
				const $form = $("#form-options");
				$form.form("validate form");
				if ($form.form("is valid")) {
					Object.assign(this.instanceRef, this.instance); // update store
					InstanceListStore.syncToStore();
					return;
				}
				else {
					return false; // prevent close action
				}
			}
		}).modal("show");
	}

	private handleInput(e: InputEvent): void {
		const target: HTMLInputElement = e.currentTarget! as HTMLInputElement;
		this.canSave = true;
		switch (target.getAttribute("name")) {
			case "instance-name":
				this.instance!.name = target.value;
		}
	}
}
