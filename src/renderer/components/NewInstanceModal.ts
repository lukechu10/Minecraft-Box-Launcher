import { LitElement, customElement, TemplateResult, html, css, query, property } from "lit-element";
import fomantic from "../../../semantic/dist/semantic.min.css";
import type { Version, VersionList } from "@xmcl/installer/minecraft";
import InstanceListStore from "../store/InstanceListStore";
import { v4 as uuidv4 } from "uuid";

@customElement("new-instance-modal")
export class NewInstanceModal extends LitElement {
	public constructor() {
		super();
		document.querySelector("#new-instance-button")!.addEventListener("click", () => { this.showModal(); });

		// update version list
		(async (): Promise<void> => {
			const { getVersionList } = await import("../utils/version");
			this.versionList = await getVersionList();
			this.updateVersionTable();
		})();
	}

	@query("#client-dropdown")
	private clientDropdown!: HTMLSelectElement;
	@query("form")
	private form!: HTMLFormElement;
	
	@property({ type: Object }) private versionList: VersionList | null = null;
	@property({ type: Array }) private versionListFiltered: Version[] = [];
	@property({ type: Object }) private selectedVersion: Version | null = null;
	@property({ type: String }) private errorMessage = "";

	public static styles = [
		// @ts-expect-error
		css([fomantic.toString()]),
		css`
			#error-message {
				font-weight: bold;
				color: red;
			}
		`
	];

	protected render(): TemplateResult {
		return html`
			<div class="ui longer modal">
				<div class="header">Create New Instance</div>
				<div class="scrolling content">
					<form class="ui form">
						<div class="field">
							<label>Instance Name</label>
							<input id="instance-name" class="ui input" type="text" name="instance-name" placeholder="Instance Name">
						</div>
						<div class="field">
							<label>Minecraft Client Type</label>
							<select class="ui fluid selection dropdown" id="client-dropdown">
								<option value="vanilla">Vanilla</option>
								<option value="optifine" disabled>OptiFine (Coming soon!)</option>
								<option value="forge" disabled>Forge (Coming soon!)</option>
								<option value="custom" disabled>Custom (Coming soon!)</option>
							</select>
						</div>
						<div class="inline fields">
							<label>Minecraft Client Version</label>
							<div class="field">
								<div class="ui checkbox">
									<input id="show-vanilla-releases" type="checkbox" checked @change=${this.updateVersionTable}>
									<label>Show Vanilla Releases</label>
								</div>
							</div>
							<div class="field">
								<div class="ui checkbox">
									<input id="show-vanilla-snapshots" type="checkbox" @change=${this.updateVersionTable}>
									<label>Show Vanilla Snapshots</label>
								</div>
							</div>
							<div class="field">
								<div class="ui checkbox">
									<input id="show-vanilla-historical" type = "checkbox" @change=${ this.updateVersionTable}>
									<label>Show Vanilla Historical Versions</label>
								</div>
							</div>
						</div>
						<p><strong>Selected version: </strong>${this.selectedVersion?.id ?? "none"}</p>
						<table class="ui compact selectable striped table">
							<thead>
								<th>Version</th>
							</thead>
							<tbody>
								${this.versionListFiltered.map(version => html`
									<tr @click=${(e: Event): void => { this.selectedVersion = version; }}>
										<td>${version.id}</td>
									</tr>	
								`)}
							</tbody>
						</table>
					</form>
					
				</div>
				<div class="actions">
					<span id="error-message">${this.errorMessage}</span>
					<button class="ui primary button" @click=${this.createNewInstance}>Create</button>
					<button class="ui cancel button">Cancel</button>
				</div>
			</div>
		`;
	}

	protected updated(): void {
		$(this.clientDropdown).dropdown();
	}

	private updateVersionTable(): void {
		const showVanillaRelease: boolean = this.form.querySelector<HTMLInputElement>("#show-vanilla-releases")!.checked;
		const showVanillaSnapshots: boolean = this.form.querySelector<HTMLInputElement>("#show-vanilla-snapshots")!.checked;
		const showVanillaHistorical: boolean = this.form.querySelector<HTMLInputElement>("#show-vanilla-historical")!.checked;
		
		this.versionListFiltered = this.versionList!.versions.filter((version) =>
			(version.type === "release" && showVanillaRelease) ||
			(version.type === "snapshot" && showVanillaSnapshots) ||
			(version.type === "old_beta" && showVanillaHistorical) ||
			(version.type === "old_alpha" && showVanillaHistorical)
		);
	}

	private async createNewInstance(): Promise<void> {
		const instanceName: string = this.form.querySelector<HTMLInputElement>("#instance-name")!.value;
		if (instanceName === "") {
			this.errorMessage = "The instance cannot be unnamed";
		}
		else if (this.selectedVersion === null) {
			this.errorMessage = "You must select a version for this instance";
		}
		else {
			const { Instance } = await import("../Instance");
			const instance = new Instance({
				name: instanceName,
				lastPlayed: "never",
				uuid: uuidv4(),
				clientType: "vanilla",
				installed: false,
				...this.selectedVersion
			});
			InstanceListStore.instances.push(instance);
			InstanceListStore.syncToStore();

			// close modal
			$(this.renderRoot.querySelector(".ui.modal")!).modal("hide");
		}
	}

	public showModal(): void {
		$(this.renderRoot.querySelector(".ui.modal")!).modal({
			closable: false,
			detachable: false
		}).modal("show");
	}
}
