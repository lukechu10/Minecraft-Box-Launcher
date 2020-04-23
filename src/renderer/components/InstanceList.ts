import "./InstanceListItem";
import InstanceListItem from "./InstanceListItem";
import { remote } from "electron";
import InstanceListStore from "../store/InstanceListStore";
import { LitElement, TemplateResult, html, property, customElement } from "lit-element";
import type Instance from "../Instance";

@customElement("instance-list")
export default class InstanceList extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Array }) private instances: Instance[] = [];

	public constructor() {
		super();
		this.instances = InstanceListStore.instances;

		// this.classList.add("ui", "middle", "aligned", "divided", "selection", "list", "container");
	}

	protected render(): TemplateResult {
		const instanceList: TemplateResult[] = [];

		for (const instance of this.instances) {
			instanceList.push(html`
				<div is="instance-list-item" class="instance-item item" .instance=${instance}></div>
			`);
		}

		return html`
			${this.instances.length > 0 ? html`
				<div class="ui middle aligned divided selection list container">
					${instanceList}
				</div>
			` : html`
				<p>You don't have any instances yet. Create one to start playing. 😆</p>
			`}
		`;
	}

	protected updated(): void {
		this.querySelectorAll<InstanceListItem>(".instance-item").forEach(elem => { elem.render(); });
	}
}

// rerender list on interval to update last played
// do not update if not focused
setInterval(() => {
	if (remote.getCurrentWindow().isFocused())
		document.querySelector<InstanceList>("instance-list")?.requestUpdate();
}, 60000); // every minute

// rerender when window is focused
window.addEventListener("focus", () => {
	document.querySelector<InstanceList>("instance-list")?.requestUpdate();
});

// render list every time store changes
InstanceListStore.store.onDidAnyChange(() => {
	console.log("InstanceStore modified, rendering instance list");
	document.querySelector<InstanceList>("instance-list")?.requestUpdate();
});
