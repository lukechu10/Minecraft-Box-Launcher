import { ApplicationStore } from "../store";
import InstanceItem from "./InstanceItem";
import { remote } from "electron";

export default class InstanceList extends HTMLDivElement {
	public constructor() {
		super();

		// render list every time store changes
		ApplicationStore.instances.onDidAnyChange(() => {
			console.log("InstanceStore modified, rendering instance list");
			this.render();
		});

		// rerender list on interval to update last played
		// do not update if not focused
		setInterval(() => {
			if (remote.getCurrentWindow().isFocused())
				this.render();
		}, 60000); // every minute

		// rerender when window is focused
		window.addEventListener("focus", () => {
			this.render();
		});
	}

	public render(): void {
		const instances = ApplicationStore.instances.all; // retreive instances

		this.classList.add("ui", "raised", "segment");
		const itemsElem = document.createElement("div");
		itemsElem.classList.add("ui", "divided", "items");

		if (instances.length === 0) { // no instances, display message
			const msgElem = document.createElement("p");
			msgElem.textContent = "You don't have any instances yet. Create one to start playing. 😆";
			itemsElem.appendChild(msgElem);
		}
		else {
			for (const instance of instances) {	// add InstanceItem nodes to dom
				const node = new InstanceItem();
				node.render(instance);
				node.classList.add("item");
				itemsElem.appendChild(node);
			}
		}
		// empty children
		while (this.firstChild) {
			this.firstChild.remove();
		}

		this.appendChild(itemsElem);
	}

	private connectedCallback(): void {
		this.render();
	}
}

customElements.define("instance-list", InstanceList, { extends: "div" });
