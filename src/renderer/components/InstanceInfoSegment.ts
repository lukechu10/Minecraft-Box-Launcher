import InstanceItem from './InstanceItem';

import instanceInfoSegmentTemplate from "../templates/InstanceInfoSegment.pug";

export default class InstanceInfoSegment extends HTMLDivElement {
	private instance: InstanceItem | null = null;
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		this.render(null);
	}

	public render(instance: InstanceItem | null): void {
		this.instance = instance;
		if (this.instance !== null) {
			this.innerHTML = instanceInfoSegmentTemplate({ hasSelection: true, ...this.instance.instanceData });
		}
		else {
			this.innerHTML = instanceInfoSegmentTemplate({ hasSelection: false });
		}
	}
}

customElements.define("instance-info-segment", InstanceInfoSegment, { extends: "div" });
