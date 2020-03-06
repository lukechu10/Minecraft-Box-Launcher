import InstanceItem from "./InstanceItem";
import Instance from "../Instance";

import instanceInfoModalTemplate from "../templates/InstanceInfoModal.pug";

export default class InstanceInfoModal extends HTMLDivElement {
	private instance: Instance | null = null;
	public constructor() {
		super();
	}

	public connectedCallback(): void { }

	public render(instance: Instance): void {
		this.instance = { ...instance }.instance; // remove dom element functions
		if (this.instance !== null) {
			this.innerHTML = instanceInfoModalTemplate({ hasSelection: true, ...this.instance, lastPlayedStr: this.instance.lastPlayedStr });
		}
		$(this).modal("show"); // show modal
		// attach events
		(this.getElementsByClassName("btn-play")[0] as HTMLDivElement | undefined)?.addEventListener("click", () => { this.instance?.play(); });

		(this.getElementsByClassName("btn-rename")[0] as HTMLDivElement).addEventListener("click", () => {
			this.instance?.rename();
		});

		(this.getElementsByClassName("btn-delete")[0] as HTMLDivElement).addEventListener("click", () => {
			this.instance?.delete();
		});

		(this.getElementsByClassName("btn-saves")[0] as HTMLDivElement).addEventListener("click", () => {
			this.instance?.saves();
		});

		(this.getElementsByClassName("btn-options")[0] as HTMLDivElement).addEventListener("click", () => {
			this.instance?.options();
		});

		(this.getElementsByClassName("btn-reinstall")[0] as HTMLDivElement)?.addEventListener("click", () => {
			this.instance?.install();
		});
	}
}

customElements.define("instance-info-modal", InstanceInfoModal, { extends: "div" });
