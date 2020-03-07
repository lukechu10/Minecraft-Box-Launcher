import Instance from "../../Instance";

import instanceInfoModalTemplate from "../../templates/InstanceInfoModal.pug";

export default class Info extends HTMLDivElement {
	private instance: Instance | null = null;
	public constructor() {
		super();
	}

	public connectedCallback(): void { }

	public render(instance: Instance): void {
		this.instance = instance; // remove dom element functions
		if (this.instance !== null) {
			this.innerHTML = instanceInfoModalTemplate({ hasSelection: true, ...this.instance, lastPlayedStr: this.instance.lastPlayedStr });
		}
		$(this).modal("show"); // show modal
		// attach events
		(this.getElementsByClassName("btn-play")[0] as HTMLDivElement | undefined)?.addEventListener("click", () => { this.instance?.play(); });

		(this.getElementsByClassName("btn-rename")[0] as HTMLDivElement).addEventListener("click", () => {
			this.instance?.showModal("rename");
		});

		(this.getElementsByClassName("btn-delete")[0] as HTMLDivElement).addEventListener("click", () => {
			this.instance?.showModal("delete");
		});

		(this.getElementsByClassName("btn-saves")[0] as HTMLDivElement).addEventListener("click", () => {
			this.instance?.showModal("saves");
		});

		(this.getElementsByClassName("btn-options")[0] as HTMLDivElement).addEventListener("click", () => {
			// this.instance ?.options();
			this.instance?.showModal("options");
		});

		(this.getElementsByClassName("btn-reinstall")[0] as HTMLDivElement)?.addEventListener("click", () => {
			this.instance?.install();
		});
	}
}

customElements.define("instance-info-modal", Info, { extends: "div" });
