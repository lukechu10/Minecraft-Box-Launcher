import template from "../../templates/HomeComponents/Instance.pug";

import InstanceListStore from "../../store/InstanceListStore";
import type * as InstanceModal from "../InstanceModal";
import InstanceListItem from "../InstanceListItem";
import Instance from "../../Instance";

class Instances extends HTMLElement {
	public constructor() {
		super();
	}
	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		const list = InstanceListStore.instances;
		let instance: Instance | undefined;
		// find last played instance
		for(const item of list) {
			const date1 = new Date(item.lastPlayed).getTime();
			const date2 = instance && new Date(instance?.lastPlayed).getTime() || NaN;
			if(instance === undefined || isNaN(date2) || date1 > date2) {
				instance = item;
			}
		}

		if (instance !== undefined) {
			this.innerHTML = template({ instance, noInstance: false });
			document.getElementById("last-played-instance")?.addEventListener("click", () => {
				(document.getElementById("modal-info") as InstanceModal.Info).render(new InstanceListItem(instance));
			});
		}
		else this.innerHTML = template({ noInstance: true });

	}
}

// render list every time store changes
InstanceListStore.store.onDidAnyChange(() => {
	document.querySelector<Instances>("home-instances")?.render();
});

customElements.define("home-instances", Instances);
