import Instance from "../../Instance";
import instanceDeleteModalTemplate from "../../templates/modals/instances/ConfirmDelete.pug";


export default class ConfirmDelete extends HTMLDivElement {
	instance: Instance | null = null;
	public constructor() {
		super();
	}
	public connectedCallback(): void { }
	public render(instance: Instance): void {
		this.instance = instance;
		this.innerHTML = instanceDeleteModalTemplate(instance);
		$(this).modal({
			closable: false,
			onApprove: () => {
				const deleteFolder: boolean = (document.querySelector("#modal-confirmDelete input[name='deleteFolder']") as HTMLInputElement).checked;
				this.instance?.delete(deleteFolder);
			}
		}).modal("show");
	}
}

customElements.define("instance-delete-modal", ConfirmDelete, { extends: "div" });
