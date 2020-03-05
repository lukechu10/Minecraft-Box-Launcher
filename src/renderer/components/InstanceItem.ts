import { ChildProcess } from "child_process";

import { ApplicationStore } from "../store";
import Instance from "../Instance";
import * as InstanceOptionsController from "../InstanceOptionsRender"; // FIXME: should be wrapped in namespace

// import instance modal templates
import renameModalTemplate from "../templates/modals/instances/rename.pug";
import corruptedModalTemplate from "../templates/modals/instances/corrupted.pug";
import savesModalTemplate from "../templates/modals/instances/saves.pug";
import confirmDeleteModalTemplate from "../templates/modals/instances/confirmDelete.pug";
import instanceItemTemplate from "../templates/InstanceItem.pug"; // important item template

import moment from "moment";
import InstanceStore from '../store/InstanceStore';

export default class InstanceItem extends HTMLDivElement {
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
			(document.getElementById("modal-info") as any).render(this);
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
	 * Shows a rename modal and handles user input
	 */
	public rename(): void {
		const renameModal = document.getElementById("modal-rename");
		if (renameModal !== null) {
			renameModal.outerHTML = renameModalTemplate({ name: this.instance.name });
			$("#modal-rename").modal({
				closable: false,
				onApprove: () => {
					const find = InstanceStore.findInstance($("#input-rename").val() as string); // make sure an instance with this name does not already exist
					if (find !== undefined) {
						alert("An instance with this name already exists"); // TODO: Change to modal to match rest of UI
						return false;
					}
					else {
						this.instance.name = $("#input-rename").val() as string;
						this.instance.syncToStore();
					}
				}
			}).modal("show");
		}
	}

	/**
	 * Shows a confirm delete modal and asks if user wishes to delete instance folder
	 */
	public delete(): void {
		const deleteModal = document.getElementById("modal-confirmDelete");
		if (deleteModal !== null) {
			deleteModal.outerHTML = confirmDeleteModalTemplate({ name: this.instance.name });
			$("#modal-confirmDelete").modal({
				closable: false,
				onApprove: () => {
					// delete instance
					const deleteFolder: boolean = $("#modal-confirmDelete input[name='deleteFolder']").is(":checked");
					// InstanceController.deleteInstance(this.instanceData.name, deleteFolder);
					this.instance.delete(deleteFolder);
				}
			}).modal("show");
		}
	}

	/**
	 * Show saves modal for an instance
	 */
	public saves(): void {
		const savesModal = document.getElementById("modal-saves");
		if (savesModal !== null) {
			savesModal.outerHTML = savesModalTemplate({ name: this.instance.name });
			$("#modal-saves").modal({
				closable: false
			}).modal("show");
		}
	}

	public options(): void {
		InstanceOptionsController.showOptionsForInstance(this.instance.name);
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
		const instance = InstanceStore.findInstance(this.instance.name);
		if (instance !== undefined) {
			try {
				const res = await this.instance.launch();
				// last played should be updated, save to store
				this.instance.syncToStore();
				return res;
			}
			catch (err) {
				if (err.type === "MissingLibs") {
					// show corrupted modal
					this.alertCorrupted();
					return null;
				}
				else throw err; // pipe error
			}
		}
		else throw Error("The instance requested does not exist");
	}

	/**
	 * Display info about instance in instance info segment
	 */
	public showInstanceInfo() {

	}
}

customElements.define("instance-item", InstanceItem, { extends: "div" });
