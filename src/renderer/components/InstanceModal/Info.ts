import Instance from "../../Instance";
import type { ModalType } from "../../Instance";
import type InstanceListItem from "../InstanceListItem";

// import instanceInfoModalTemplate from "../../templates/InstanceInfoModal.pug";
import { LitElement, customElement, TemplateResult, html, property } from "lit-element";

@customElement("instance-info-modal")
export default class Info extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) private instance: Instance | null = null;
	private instanceItem: InstanceListItem | null = null;

	protected render(): TemplateResult {
		if (this.instance === null || this.instanceItem === null) {
			return html``;
		}
		else {
			return html`
				<div class="ui header">${this.instance.name}</div>
				<div class="content">
					<p>
						<strong>Type</strong>: ${this.instance.clientType} ${this.instance.type}
						<strong>Version</strong>: ${this.instance.id}
					</p>
					<p>
						<strong>Last played</strong>: ${this.instance.lastPlayedStr}
					</p>
					<div class="ui fluid buttons">
						<button class="ui button btn-rename" data-modal="rename" @click="${this.instanceShowModal}"><i class="fas fa-pencil-alt fa-fw"></i> Rename</button>
						<button class="ui button btn-options" data-modal="options" @click="${this.instanceShowModal}"><i class="far fa-edit fa-fw"></i> Options</button>
						<button class="ui button btn-saves" data-modal="saves" @click="${this.instanceShowModal}"><i class="far fa-file-alt fa-fw"></i> Saves / Data</button>
						<button class="ui red button btn-delete" data-modal="delete" @click="${this.instanceShowModal}"><i class="far fa-trash-alt fa-fw"></i> Delete</button>
					</div>
					<div class="ui divider"></div>
					${this.instance.installed ? html`
						<button class="ui huge green fluid button btn-play" @click="${this.instanceItem.play}">Play</button>
					` : html`
						<button class="ui huge olive fluid button btn-install" @click="${this.instanceItem.install}">Install</button>
					`}
				</div>
			`;
		}
	}

	/**
	 * Shows the instance modal with name in the data-modal attribute
	 * @param e click event
	 */
	private instanceShowModal(e: Event): void {
		const target: HTMLButtonElement = e.currentTarget! as HTMLButtonElement;
		const modalName = target.attributes.getNamedItem("data-modal");
		/* istanbul ignore else */
		if (modalName !== null)
			this.instance!.showModal(modalName.value as ModalType);
	}

	public async showModal(instanceItem: InstanceListItem): Promise<void> {
		this.instance = instanceItem.instance; // remove dom element functions
		this.instanceItem = instanceItem;
		await this.requestUpdate();

		$(this).modal("show"); // show modal
	}
}
