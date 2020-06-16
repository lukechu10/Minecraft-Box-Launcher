import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import Instance from "../../Instance";

@customElement("instance-modal-container")
export class InstanceModalContainer extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) private instance: Instance | null = null;

	protected render(): TemplateResult {
		if (this.instance !== null)
			return html`
				<div class="header">${this.instance.name}</div>
				<div class="ui grid">
					<div class="four wide column">
						<div class="ui vertical fluid inverted text menu">
							<a class="item">
								Quick Info
							</a>
							<a class="item">
								Saves
							</a>
							<a class="item">
								Servers
							</a>
							<a class="item">
								Advanced Options
							</a>
						</div>
					</div>
					<div class="twelve wide stretched column">
						<div class="ui basic segment">
							Content area
						</div>
					</div>
				</div>
			`;
		else return html``;
	}


	public async showModal(instance: Instance): Promise<void> {
		this.instance = instance;
		await this.requestUpdate();
		$(this).modal("show");
	}
}
