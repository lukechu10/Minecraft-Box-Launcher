import { remote } from "electron";
import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type { Instance } from "../Instance";
import InstanceListStore from "../store/InstanceListStore";
import "./InstanceListItem";
import InstanceListItem from "./InstanceListItem";

@customElement("instance-list")
export default class InstanceList extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Array }) private instances: Instance[] = InstanceListStore.instances;

	protected render(): TemplateResult {
		const instanceList: TemplateResult[] = [];

		for (const instance of this.instances) {
			instanceList.push(html`
				<instance-list-item class="instance-item item" .instance=${instance}></instance-list-item>
			`);
		}

		return html`
			<div class="ui middle aligned divided selection list container">
				${this.instances.length > 0 ? instanceList : html`
					<p>You don't have any instances yet. Create one to start playing. 😆</p>
				`}
			</div>
		`;
	}

	protected updated(): void {
		this.querySelectorAll<InstanceListItem>(".instance-item").forEach(elem => { elem.requestUpdate(); });
	}
}

// update list on interval to update last played
// do not update if not focused
setInterval(() => {
	if (remote.getCurrentWindow().isFocused())
		document.querySelector<InstanceList>("instance-list")?.requestUpdate();
}, 60000); // every minute

// update when window is focused
window.addEventListener("focus", () => {
	document.querySelector<InstanceList>("instance-list")?.requestUpdate();
});

// render list every time store changes
InstanceListStore.store.onDidAnyChange(() => {
	console.log("InstanceStore modified, rendering instance list");
	document.querySelector<InstanceList>("instance-list")?.requestUpdate();
});
