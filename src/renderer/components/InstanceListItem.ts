import { ChildProcess } from "child_process";

import Instance from "../Instance";

// import instance modal templates
import corruptedModalTemplate from "../templates/modals/instances/corrupted.pug";
import instanceItemTemplate from "../templates/InstanceItem.pug"; // important item template

import InstanceListStore from "../store/InstanceListStore";
import { AuthModal } from "./AuthModal";

export default class InstanceListItem extends HTMLDivElement {
	public instance: Instance;

	public constructor(data?: Instance) {
		super();
		this.instance = data as any;
	}

	public render(newData?: Instance): void {
		if (newData !== undefined) this.instance = newData;
		this.innerHTML = instanceItemTemplate({ data: { ...this.instance, lastPlayedStr: this.instance.lastPlayedStr } }); // render template
		(this.getElementsByClassName("btn-instance-actions")[0] as HTMLDivElement).addEventListener("click", e => { e.stopPropagation(); });
		// show data in instance info segment
		this.addEventListener("click", () => {
			this.instance.showModal("info");
		});

		this.addEventListener("mouseenter", () => {
			$(this.getElementsByClassName("btn-instance-actions")[0]).stop().fadeIn({
				duration: 70,
				queue: false
			});
		});
		this.addEventListener("mouseleave", () => {
			$(this.getElementsByClassName("btn-instance-actions")[0]).stop().fadeOut({
				duration: 70,
				queue: false
			});
		});

		(this.getElementsByClassName("btn-install")[0] as HTMLDivElement) ?.addEventListener("click", () => {
			this.install();
		});

		(this.getElementsByClassName("btn-play")[0] as HTMLDivElement) ?.addEventListener("click", () => {
			this.play();
		});
	}

	/**
	 * Shows a modal that display a warning to the user that the current instance is corrupted
	 */
	public alertCorrupted(): void {
		const corruptedModal = document.getElementById("modal-corrupted");
		if (corruptedModal !== null) {
			corruptedModal.outerHTML = corruptedModalTemplate({ name: this.instance.name });
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
		await this.instance.install();
		this.instance.syncToStore();
		this.render();
	}

	public async play(): Promise<ChildProcess | null> {
		// FIXME: move logic here
		// launch by name
		const instance = InstanceListStore.findInstance(this.instance.name);
		if (instance !== undefined) {
			try {
				const res = await this.instance.launch();
				// last played should be updated, save to store
				this.instance.syncToStore();
				return res;
			}
			catch (err) {
				if (err.type === "MissingLibs" || err.error === "CorruptedVersionJson") {
					// show corrupted modal
					this.alertCorrupted();
					return null;
				}
				if (err.message === "User not logged in") {
					const authRes = (document.getElementById("modal-auth") as AuthModal).waitForAuth();
					if (authRes !== null) {
						// attempt to launch again
						return await this.play();
					}
					else return null;
				}
				else throw err; // pipe error
			}
		}
		else throw Error("The instance requested does not exist");
	}
}

customElements.define("instance-item", InstanceListItem, { extends: "div" });
