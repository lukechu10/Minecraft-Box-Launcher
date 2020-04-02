import template from "../../templates/HomeComponents/Instance.pug";

import InstanceListStore from "../../store/InstanceListStore";
import type * as InstanceModal from "../InstanceModal";
import InstanceListItem from "../InstanceListItem";

class Instances extends HTMLElement {
	public constructor() {
		super();
	}
	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		const instance = InstanceListStore.instances[0];
		this.innerHTML = template({ instance });
		document.getElementById("last-played-instance")?.addEventListener("click", () => {
			(document.getElementById("modal-info") as InstanceModal.Info).render(new InstanceListItem(instance));
		});
	}
}

// render list every time store changes
InstanceListStore.store.onDidAnyChange(() => {
	document.querySelector<Instances>("home-instances")?.render();
});

customElements.define("home-instances", Instances);
