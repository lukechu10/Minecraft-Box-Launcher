import InstanceListItem from "./InstanceListItem";
import { remote } from "electron";
import InstanceListStore from "../store/InstanceListStore";

export default class InstanceList extends HTMLDivElement {
	public constructor() {
		super();
	}

	public render(): void {
		// empty children
		while (this.firstChild) {
			this.firstChild.remove();
		}
		const instances = InstanceListStore.instances; // retreive instances

		this.classList.add("ui", "middle", "aligned", "divided", "selection", "list", "container");

		if (instances.length === 0) { // no instances, display message
			const msgElem = document.createElement("p");
			msgElem.textContent = "You don't have any instances yet. Create one to start playing. 😆";
			this.appendChild(msgElem);
		}
		else {
			for (const instance of instances) {	// add InstanceItem nodes to dom
				const node = new InstanceListItem(instance);
				node.classList.add("instance-item");
				node.render();
				node.classList.add("item");
				this.appendChild(node);
			}
		}
	}

	/**
	 * Same to `render()` but without destroying child nodes. This should only be used if the number of instances do not change.
	 */
	public refresh(): void {
		const instances = InstanceListStore.instances;
		if (instances.length !== 0) {
			for (let i = 0; i < this.children.length; i++) {
				(this.children[i] as InstanceListItem).render(instances[i]);
			}
		}
	}

	private connectedCallback(): void {
		this.render();
	}
}

customElements.define("instance-list", InstanceList, { extends: "div" });

// rerender list on interval to update last played
// do not update if not focused
setInterval(() => {
	if (remote.getCurrentWindow().isFocused())
		document.querySelector<InstanceList>("div[is='instance-list']")?.refresh();
}, 60000); // every minute

// rerender when window is focused
window.addEventListener("focus", () => {
	document.querySelector<InstanceList>("div[is='instance-list']")?.refresh();
});

// render list every time store changes
InstanceListStore.store.onDidAnyChange(() => {
	console.log("InstanceStore modified, rendering instance list");
	document.querySelector<InstanceList>("div[is='instance-list']")?.render();
});
