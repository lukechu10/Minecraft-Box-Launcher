import { ChildProcess } from "child_process";
import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { Instance } from "../Instance";
import { InstanceProcess } from "../store/InstanceData";
import InstanceListStore from "../store/InstanceListStore";
// import instance modal templates
import corruptedModalTemplate from "../templates/modals/instances/corrupted.pug";
import type { AuthModal } from "./AuthModal";
import type { InstanceModalContainer } from "./instance/InstanceModalContainer";

@customElement("instance-list-item")
export default class InstanceListItem extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;

	protected render(): TemplateResult {
		return html`
			<div class="content" @click="${this.showInfoModal}"
				@mouseenter="${this.showButton}" @mouseleave="${this.hideButton}">
				<div class="ui grid">
					<div class="thirteen wide column">
						<p class="ui header text-instanceName">
							${this.instance!.name}
							${this.instance!.installed ? "" : html`
								<i class="fas fa-download fa-fw" style="color: #b5cc18"></i>
							`}
						</p>
						<p class="description">
							${this.instance!.clientType || "vanilla"}
							<strong>${this.instance!.id} ${this.instance!.type}</strong>
							Last played: <i>${this.instance!.lastPlayedStr}</i>
						</p>
					</div>
					<div class="three wide column">
						<div class="ui right floated buttons btn-instance-actions" style="display: none" @click="${(e: Event): void => e.stopPropagation()}">
							${this.instance!.isInstalling ? html`
								<button class="ui gray button disabled">Installing...</button>
							` : this.instance!.installed ? html`
								<button class="ui green button btn-play btn-play-install" @click="${this.play}">Play</button>
							` : html`
								<button class="ui olive button btn-install btn-play-install" @click="${this.install}">Install</button>
							`}
						</div>
					</div>
				</div>
			</div>
		`;
	}

	// arrow function to prevent binding to this
	private updateCallback = (): void => { this.requestUpdate(); };

	protected firstUpdated(): void {
		/* istanbul ignore next */
		if (this.instance === null) throw new Error("Property instance must be set");

		this.instance.on("changed", this.updateCallback);
	}

	public disconnectedCallback(): void {
		super.disconnectedCallback();
		/* istanbul ignore next */
		if (this.instance === null) throw new Error("Property instance must be set");
		
		this.instance.off("changed", this.updateCallback);
	}

	private async showInfoModal(): Promise<void> {
		await import(/* webpackChunkName: "InstanceModalContainer" */ "./instance/InstanceModalContainer");
		document.querySelector<InstanceModalContainer>("instance-modal-container")!.showModal(this.instance!);
	}

	private showButton(): void {
		$(this.getElementsByClassName("btn-instance-actions")[0]).stop().fadeIn({
			duration: 70,
			queue: false
		});
	}
	private hideButton(): void {
		$(this.getElementsByClassName("btn-instance-actions")[0]).stop().fadeOut({
			duration: 70,
			queue: false
		});
	}

	/**
	 * Shows a modal that display a warning to the user that the current instance is corrupted
	 */
	private alertCorrupted(): void {
		const corruptedModal = document.getElementById("modal-corrupted");
		if (corruptedModal !== null) {
			corruptedModal.outerHTML = corruptedModalTemplate({ name: this.instance!.name });
			$("#modal-corrupted").modal({
				closable: false,
				onApprove: () => {
					this.installDependencies();
				}
			}).modal("show");
		}
	}

	/**
	 * Installs the instance
	 */
	public async install(): Promise<void> {
		const installTask = this.instance!.install();
		await Promise.resolve(installTask); // wait for install task to finish
		InstanceListStore.syncToStore(); // update installed state in store
	}

	/**
	 * Install the dependencies of the instance
	 */
	public async installDependencies(): Promise<void> {
		const installTask = this.instance!.install(true); // only install dependencies
		await Promise.resolve(installTask); // wait for install task to finish
		InstanceListStore.syncToStore(); // update installed state in store
	}

	public async play(): Promise<ChildProcess | null> {
		// launch by name
		try {
			const proc = await this.instance!.launch();
			// last played should be updated, save to store
			InstanceListStore.syncToStore();

			this.instance!.process = new InstanceProcess(proc);
			return proc;
		}
		catch (err) {
			console.warn(err);
			if (err.error === "MissingLibraries" || err.error === "MissingVersionJson" || err.error === "CorruptedVersionJson") {
				// show corrupted modal
				this.alertCorrupted();
				return null;
			}
			if (err.message === "User not logged in") {
				await import("./AuthModal");
				const authRes = await document.querySelector<AuthModal>("#modal-login")!.showModal();
				if (authRes !== null) {
					// attempt to launch again
					return await this.play();
				}
				else return null;
			}
			else throw err; // pipe error
		}
	}

}
