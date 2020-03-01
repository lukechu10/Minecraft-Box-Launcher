import InstanceItem from "./InstanceItem";

import instanceInfoSegmentTemplate from "../templates/InstanceInfoModal.pug";

export default class InstanceInfoModal extends HTMLDivElement {
	private instance: InstanceItem | null = null;
	public constructor() {
		super();
	}

	public connectedCallback(): void { }

	public render(instance: InstanceItem | null): void {
		this.instance = instance;
		if (this.instance !== null) {
			this.innerHTML = instanceInfoSegmentTemplate({ hasSelection: true, ...this.instance.instanceData });
		}
		$(this).modal("show"); // show modal
	}
}

customElements.define("instance-info-modal", InstanceInfoModal, { extends: "div" });
