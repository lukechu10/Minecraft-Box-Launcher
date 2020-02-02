import instanceListTemplate from "../templates/instanceList.pug";
import { ApplicationStore } from "../store";

export default class InstanceList extends HTMLElement {
	public constructor() {
		super();

		// render list every time store changes
		ApplicationStore.instances.onDidAnyChange(this.render); // FIXME: event not triggering
	}

	public render(): void {
		this.innerHTML = instanceListTemplate({ data: ApplicationStore.instances.all }); // render template
		$(this).find(".ui.dropdown").dropdown(); // attach FUI dropdown handler
	}

	private connectedCallback(): void {
		this.render();
	}
}

customElements.define("instance-list", InstanceList);
