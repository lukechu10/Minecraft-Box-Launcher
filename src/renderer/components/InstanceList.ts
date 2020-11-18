import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type { Instance } from "../Instance";
import InstanceListStore from "../store/InstanceListStore";
import "./InstanceListItem";
import InstanceListItem from "./InstanceListItem";
import { remote } from "electron";

@customElement("instance-list")
export class InstanceList extends LitElement {
	protected createRenderRoot(): this { return this; }

	private intervalId: unknown; // FIXME: NodeJS.Timeout in nodejs, number in browser
	private didAnyChangeRes: () => void;
	// use arrow function to prevent binding to this
	private changeCallback = (): void => {
		if (remote.getCurrentWindow().isFocused()) {
			this.requestUpdate();
		}
	};

	public constructor() {
		super();
		// update list on interval to update last played
		// do not update if not focused
		this.intervalId = setInterval(this.changeCallback, 60000); // every minute

		// update when window is focused
		window.addEventListener("focus", this.changeCallback);

		// render list every time store changes
		this.didAnyChangeRes = InstanceListStore.store.onDidAnyChange(this.changeCallback);
	}

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

	/**
	 * Remove all events
	 */
	public disconnectedCallback(): void {
		super.disconnectedCallback();

		// remove setInterval
		clearInterval(this.intervalId as number);
		// remove window.addEventListener("focus")
		window.removeEventListener("focus", this.changeCallback);
		// remove InstanceListStore.store.onDidAnyChange
		this.didAnyChangeRes();
	}
}
