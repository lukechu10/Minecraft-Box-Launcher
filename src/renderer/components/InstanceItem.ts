import instanceItemTemplate from "../templates/InstanceItem.pug";
import { ApplicationStore } from "../store";
import { InstanceData } from '../store/InstanceData';

export default class InstanceItem extends HTMLDivElement {
	public constructor() {
		super();
	}

	public render(data: InstanceData): void {
		this.innerHTML = instanceItemTemplate({ data }); // render template
		$(this).find(".ui.dropdown").dropdown(); // attach FUI dropdown handler
	}
}

customElements.define("instance-item", InstanceItem, { extends: "div" });
