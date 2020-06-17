import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type Instance from "../../Instance";

import "./QuickInfoPage";

const enum InstanceModalPage {
	QuickInfo = 0,
	Saves,
	Servers,
	AdvancedOptions
}

@customElement("instance-modal-container")
export class InstanceModalContainer extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) private instance: Instance | null = null;
	@property() private currentPage: InstanceModalPage = InstanceModalPage.QuickInfo;

	protected render(): TemplateResult {
		if (this.instance !== null) {
			let content: TemplateResult;
			switch (this.currentPage) {
				case InstanceModalPage.QuickInfo:
					import("./QuickInfoPage");
					content = html`<quick-info-page></quick-info-page>`;
					break;
				case InstanceModalPage.Saves:
					content = html`Saves`;
					break;
				case InstanceModalPage.Servers:
					content = html`Servers`;
					break;
				case InstanceModalPage.AdvancedOptions:
					content = html`Advanced Options`;
					break;
			}

			return html`
				<h1 class="header">${this.instance.name}</h1>
				<div class="ui grid">
					<div class="four wide column">
						<div class="ui vertical fluid inverted text menu">
							<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.QuickInfo}>Quick Info</a>
							<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.Saves}>Saves</a>
							<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.Servers}>Servers</a>
							<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.AdvancedOptions}>Advanced Options</a>
						</div>
					</div>
					<div class="twelve wide stretched column scrolling content">
						<div class="ui basic segment" id="#InstanceModalContainer-contentArea">${content}</div>
					</div>
				</div>
			`;
		}
		else return html``;
	}

	private handlePageLink(event: Event): void {
		const pageLink: InstanceModalPage = (event.target! as any).pageLink;
		this.currentPage = pageLink;
	}

	public async showModal(instance: Instance): Promise<void> {
		this.instance = instance;
		this.currentPage = InstanceModalPage.QuickInfo; // default page is QuickInfo page
		await this.requestUpdate();
		$(this).modal("show");
	}
}
