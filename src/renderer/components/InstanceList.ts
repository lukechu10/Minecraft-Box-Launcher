import instanceListTemplate from "../templates/instanceList.pug";
import { ApplicationStore } from "../store";

export default class InstanceList extends HTMLDivElement {
	public constructor() {
		super();

		// render list every time store changes
		ApplicationStore.instances.onDidAnyChange(() => {
			console.log("InstanceStore modified, rendering instance list");
			this.render();
		});
	}

	public render(): void {
		this.innerHTML = instanceListTemplate({ data: ApplicationStore.instances.all }); // render template
		$(this).find(".ui.dropdown").dropdown(); // attach FUI dropdown handler
	}

	private connectedCallback(): void {
		this.render();
	}
}

customElements.define("instance-list", InstanceList, { extends: "div" });
