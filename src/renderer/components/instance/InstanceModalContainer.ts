import "@vaadin/vaadin-button";
import { customElement, html, LitElement, property, query, TemplateResult } from "lit-element";
import { Instance } from "../../Instance";
import InstanceListStore from "../../store/InstanceListStore";
import type { UnsavedDataWarning } from "./UnsavedDataWarning";

const enum InstanceModalPage {
	QuickInfo = 0,
	Saves,
	Servers,
	Logs,
	Mods,
	Delete,
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
		return this.unsavedDataWarning.hasUnsavedChanges;
	}

	protected render(): TemplateResult {
		if (this.tempInstance !== null) {
			let content: TemplateResult;
			switch (this.currentPage) {
				case InstanceModalPage.QuickInfo:
					import("./QuickInfoPage");
					content = html`<quick-info-page .instance=${this.tempInstance} @instanceChanged=${(): void => {
						this.requestUpdate("tempInstance");
						if (!this.hasUnsavedData) {
							this.unsavedDataWarning.show();
						}
					}
					}></quick-info-page>`;
					break;
				case InstanceModalPage.Saves:
					import("./SavesPage");
					content = html`<saves-page .instance=${this.tempInstance}></saves-page>`;
					break;
				case InstanceModalPage.Servers:
					import("./ServersPage");
					content = html`<servers-page .instance=${this.tempInstance}></servers-page>`;
					break;
				case InstanceModalPage.Logs:
					import("./LogsPage");
					content = html`<logs-page .instance=${this.tempInstance}></logs-page>`;
					break;
				case InstanceModalPage.Mods:
					import("./ModsPage");
					content = html`<mods-page .instance=${this.tempInstance}></mods-page>`;
					break;
				case InstanceModalPage.Delete:
					import("./DeletePage");
					content = html`<delete-page .instance=${this.tempInstance} @deleted=${(): void => {
						$(this).modal("hide");
					}}></delete-page>`;
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
								<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.Logs}>Logs</a>
								<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.Mods}>Mods</a>
								<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.Delete}>Delete</a>
								<a class="item" @click=${this.handlePageLink} .pageLink=${InstanceModalPage.AdvancedOptions}>Advanced Options</a>
								${this.instance!.process?.isRunning ? html`
									<vaadin-button theme="success" disabled style="width: 100%;">Running</vaadin-button>
								` : this.instance!.isInstalling ? html`
									<vaadin-button theme="success" disabled style="width: 100%;">Installing</vaadin-button>
								` : this.instance!.installed ? html`
									<vaadin-button theme="success primary" style="width: 100%;" @click=${(): void => { this.instance?.launch(); }}>Play</vaadin-button>
								` : html`
									<vaadin-button theme="success" style="width: 100%;" @click=${(): void => { this.instance?.install(); }}>Install</vaadin-button>
								`}
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

	// arrow function to prevent binding to this
	private updateCallback = (): void => { this.requestUpdate(); };

	public disconnectedCallback(): void {
		super.disconnectedCallback();
		if (this.instance !== null) {
			this.instance.off("changed", this.updateCallback); // remove event handler for current instance
		}
	}

	private handlePageLink(event: Event): void {
		const pageLink: InstanceModalPage = (event.target! as unknown as { pageLink: InstanceModalPage }).pageLink;
		if (this.hasUnsavedData) {
			// do not allow navigate if unsaved data
			this.unsavedDataWarning.shake();
		}
		else {
			this.currentPage = pageLink;
		}
	}

	// #region unsaved-data-warning logic
	private handleSave(): void {
		Object.assign(this.instance, this.tempInstance); // copy tempInstance to instance
		InstanceListStore.syncToStore(); // update stored version
	}

	private handleDiscard(): void {
		this.tempInstance = Object.assign(Object.create(Instance.prototype), this.instance); // reset tempInstance with instance
		this.requestUpdate("tempInstance");
	}
	// #endregion

	public async showModal(instance: Instance): Promise<void> {
		if (this.instance !== null) {
			this.instance.off("changed", this.updateCallback); // remove event handler for previous instance
		}

		this.instance = instance;
		this.tempInstance = Object.assign(Object.create(Instance.prototype), this.instance); // create clone

		this.instance.on("changed", this.updateCallback); // add new event handler

		this.currentPage = InstanceModalPage.QuickInfo; // default page is QuickInfo page
		await this.requestUpdate();
		$(this).modal({
			onHide: () => {
				// make sure there is no unsaved data
				if (this.hasUnsavedData) {
					this.unsavedDataWarning.shake();
					return false;
				}
			}
		}).modal("show");
	}
}
