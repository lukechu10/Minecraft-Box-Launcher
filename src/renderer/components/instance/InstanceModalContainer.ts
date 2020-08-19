import { customElement, html, LitElement, property, query, TemplateResult } from "lit-element";
import type Instance from "../../Instance";
import InstanceListStore from "../../store/InstanceListStore";
import type { UnsavedDataWarning } from "./UnsavedDataWarning";

const enum InstanceModalPage {
	QuickInfo = 0,
	Saves,
	Servers,
	AdvancedOptions
}

@customElement("instance-modal-container")
export class InstanceModalContainer extends LitElement {
	protected createRenderRoot(): this { return this; }

	private instance: Instance | null = null; // reference to original instance, updated with tempInstance on save
	@property({ type: Object }) private tempInstance: Instance | null = null; // temp clone of original instance
	@property({ type: Number }) private currentPage: InstanceModalPage = InstanceModalPage.QuickInfo;

	@query("unsaved-data-warning")
	private unsavedDataWarning!: UnsavedDataWarning;
	private get hasUnsavedData(): boolean {
		return this.unsavedDataWarning.classList.contains("visible");
	}

	protected render(): TemplateResult {
		if (this.tempInstance !== null) {
			let content: TemplateResult;
			switch (this.currentPage) {
				case InstanceModalPage.QuickInfo:
					import("./QuickInfoPage");
					content = html`<quick-info-page .instance=${this.tempInstance} .nameChangeCallback=${(): void => {
						this.requestUpdate("tempInstance");
						if (!this.hasUnsavedData) {
							$(this.unsavedDataWarning).transition("fade in"); // show warning
						}
					}
					}></quick-info-page>`;
					break;
				case InstanceModalPage.Saves:
					import("./SavesPage");
					content = html`<saves-page></saves-page>`;
					break;
				case InstanceModalPage.Servers:
					import("./ServersPage");
					content = html`<servers-page></servers-page>`;
					break;
				case InstanceModalPage.AdvancedOptions:
					import("./AdvancedOptionsPage");
					content = html`<advanced-options-page></advanced-options-page>`;
					break;
			}
			
			import("./UnsavedDataWarning");
			return html`
				<h1 class="header">${this.tempInstance.name}</h1>
				<div class="content">
					<!-- TODO: remove inline style tag (perf) -->
					<style scoped>
						unsaved-data-warning {
							position: fixed;
							top: 10px;
							right: 10px;
							visibility: hidden;
						}
					</style>
					<unsaved-data-warning id="QuickInfoPage-unsavedDataWarning" @saved=${this.handleSave} @discarded=${this.handleDiscard}></unsaved-data-warning>
					<div class="ui divided grid">
						<div class="four wide column">
							<div class="ui vertical fluid text menu">
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
				</div>
			`;
		}
		else return html``;
	}

	private handlePageLink(event: Event): void {
		const pageLink: InstanceModalPage = (event.target! as any).pageLink;
		if (this.hasUnsavedData) {
			// do not allow navigate if unsaved data
			this.shakeUnsavedDataWarning();
		}
		else {
			this.currentPage = pageLink;
		}
	}

	// #region unsaved-data-warning logic
	private handleSave(): void {
		Object.assign(this.instance, this.tempInstance); // copy tempInstance to instance
		InstanceListStore.syncToStore(); // update stored version
		$(this.unsavedDataWarning).transition("fade out");
	}

	private handleDiscard(): void {
		Object.assign(this.tempInstance, this.instance); // reset tempInstance with instance
		this.requestUpdate();
		$(this.unsavedDataWarning).transition("fade out");
	}

	/**
	 * Applies 'shake' transition to unsavedDataWarning
	 */
	private shakeUnsavedDataWarning(): void {
		$(this.unsavedDataWarning).transition("shake");
		this.unsavedDataWarning.style.visibility = "visible"; // prevent unsavedDataWarning from disapearing
	}
	// #endregion

	public async showModal(instance: Instance): Promise<void> {
		this.instance = instance;
		this.tempInstance = Object.assign({}, instance); // create clone

		this.currentPage = InstanceModalPage.QuickInfo; // default page is QuickInfo page
		await this.requestUpdate();
		$(this).modal({
			onHide: () => {
				// make sure there is no unsaved data
				if (this.hasUnsavedData) {
					this.shakeUnsavedDataWarning();
					return false;
				}
			}
		}).modal("show");
	}
}
