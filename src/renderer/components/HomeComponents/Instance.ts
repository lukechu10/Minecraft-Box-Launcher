import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import Instance from "../../Instance";
import InstanceListStore from "../../store/InstanceListStore";
import InstanceListItem from "../InstanceListItem";
import type * as InstanceModal from "../InstanceModal";

@customElement("home-instances")
class Instances extends LitElement {
	protected createRenderRoot(): this { return this; }

	/**
	 * Last played instance
	 */
	@property({ type: Object }) private instance: Instance | null = null;

	public constructor() {
		super();
		this.updateLastPlayedInstance(); // get last played instance and modify state before first render
	}

	protected render(): TemplateResult {
		return html`
			<h5 class="ui header">Last Played</h5>
			<a class="ui top right attached primary label" href="./instances.html">View all</a>
				${this.instance === null ? html`
					<div class="ui segment" style="margin-top: 0 !important">
						<span>No instance created yet. Create one to view it here.</span>
					</div>
				` : html`
					<div class="ui segment" id="last-played-instance" style="margin-top: 0 !important" @click="${this.showInfoModal}">
						<span>
							<strong>${this.instance.name}</strong>
							(${this.instance.id} ${this.instance.type})
						</span>
						<div class="meta">
							Last played: ${this.instance.lastPlayedStr}
						</div>
					</div>
				`}
			</div>
		`;
	}

	private showInfoModal(): void {
		const instanceListItem = new InstanceListItem();
		instanceListItem.instance = this.instance!;
		document.querySelector<InstanceModal.Info>("#modal-info")!.showModal(instanceListItem);
	}

	/**
	 * Finds the last played instance and updates the state to trigger rerender
	 */
	public updateLastPlayedInstance(): void {
		const list = InstanceListStore.instances;
		// create temp variable to not consistantly modify component state
		let instance: Instance | null = null;
		// find last played instance
		for (const item of list) {
			const date1 = new Date(item.lastPlayed).getTime();
			const date2 = instance && new Date(instance?.lastPlayed).getTime() || NaN;

			if (instance === undefined || isNaN(date2) || date1 > date2)
			// update most recent instance found so far
			{
				instance = item;
			}
		}

		// update component state
		this.instance = instance;
	}
}

// render list every time store changes
InstanceListStore.store.onDidAnyChange(() => {
	document.querySelector<Instances>("home-instances")?.updateLastPlayedInstance();
});
