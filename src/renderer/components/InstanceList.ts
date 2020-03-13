import InstanceListItem from "./InstanceListItem";
import { remote } from "electron";
import InstanceStore from "../store/InstanceStore";
import Instance from "../Instance";

export default class InstanceList extends HTMLDivElement {
	public constructor() {
		super();
	}

	public render(): void {
		// empty children
		while (this.firstChild) {
			this.firstChild.remove();
		}
		const instances = InstanceStore.get("instances"); // retreive instances

		this.classList.add("ui", "middle", "aligned", "divided", "selection", "list", "container");

		if (instances.length === 0) { // no instances, display message
			const msgElem = document.createElement("p");
			msgElem.textContent = "You don't have any instances yet. Create one to start playing. 😆";
			this.appendChild(msgElem);
		}
		else {
			for (const instance of instances) {	// add InstanceItem nodes to dom
				const node = new InstanceListItem(new Instance(instance));
				node.classList.add("instance-item");
				node.render();
				node.classList.add("item");
				this.appendChild(node);
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
		document.querySelector<InstanceList>("div[is='instance-list']")?.render();
}, 60000); // every minute

// rerender when window is focused
window.addEventListener("focus", () => {
	document.querySelector<InstanceList>("div[is='instance-list']")?.render();
});

// render list every time store changes
InstanceStore.onDidAnyChange(() => {
	console.log("InstanceStore modified, rendering instance list");
	document.querySelector<InstanceList>("div[is='instance-list']")?.render();
});
