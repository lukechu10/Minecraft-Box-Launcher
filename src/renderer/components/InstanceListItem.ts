import { ChildProcess } from "child_process";
import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import Instance from "../Instance";
import InstanceListStore from "../store/InstanceListStore";
// import instance modal templates
import corruptedModalTemplate from "../templates/modals/instances/corrupted.pug";
import { AuthModal } from "./AuthModal";
import * as InstanceModal from "./InstanceModal";

@customElement("instance-list-item")
export default class InstanceListItem extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;

	protected render(): TemplateResult {
		if (this.instance === null) {
			return html``;
		}
		return html`
			<div class="content" @click="${this.showInfoModal}"
				@mouseenter="${this.showButton}" @mouseleave="${this.hideButton}">
				<div class="ui grid">
					<div class="thirteen wide column">
						<p class="ui header text-instanceName">
							${this.instance.name}
							${this.instance.installed ? "" : html`
								<i class="fas fa-download fa-fw" style="color: #b5cc18"></i>
							`}
						</p>
						<p class="description">
							${this.instance.clientType || "vanilla"}
							<strong>${this.instance.id} ${this.instance.type}</strong>
						</p>
					</div>
					<div class="three wide column">
						<div class="ui right floated buttons btn-instance-actions" style="display: none" @click="${(e: Event): void => e.stopPropagation()}">
							${this.instance.isInstalling ? html`
								<button class="ui gray button disabled">Installing...</button>
							` : this.instance.installed ? html`
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

	private showInfoModal(): void {
		(document.getElementById("modal-info") as InstanceModal.Info).render(this);
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
					this.install();
				}
			}).modal("show");
		}
	}

	/**
	 * Installs the instance
	 */
	public async install(): Promise<void> {
		const btn = (this.getElementsByClassName("btn-play-install")[0] as HTMLButtonElement);
		btn.classList.remove("olive", "green");
		btn.classList.add("gray", "disabled");
		btn.textContent = "Installing...";
		await this.instance!.install();
		InstanceListStore.syncToStore();
	}

	public async play(): Promise<ChildProcess | null> {
		// launch by name
		try {
			const res = await this.instance!.launch();
			// last played should be updated, save to store
			InstanceListStore.syncToStore();
			return res;
		}
		catch (err) {
			console.dir(err);
			if (err.error === "MissingLibraries" || err.error === "CorruptedVersionJson") {
				// show corrupted modal
				this.alertCorrupted();
				return null;
			}
			if (err.message === "User not logged in") {
				const authRes = await (document.getElementById("modal-login") as AuthModal).waitForAuth();
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
