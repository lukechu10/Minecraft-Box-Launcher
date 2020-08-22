import { html, LitElement, TemplateResult, customElement, css } from "lit-element";
import "../InstanceList";
import fomantic from "../../../../semantic/dist/semantic.min.css";
import type { NewInstanceModal } from "../NewInstanceModal";

@customElement("instance-view")
export class InstanceView extends LitElement {
	public static styles = [
		// @ts-expect-error
		css([fomantic.toString()]),
		css`
			#instance-list-container {
				margin-top: 10px;
			}
		`
	];

	protected render(): TemplateResult {
		return html`
			<div>
				<h1>Instances</h1>
				<button class="ui button right floated green inverted" @click=${this.showSettingsModal}><i class="fas fa-sliders-h fa-fw"></i>Settings</button>
				<button id="new-instance-button" class="ui primary button" @click=${this.showNewInstanceModal}><i class="fas fa-plus fa-fw"></i>New Instance</button>
			</div>
			<div id="instance-list-container">
				<instance-list></instance-list>
			</div>
		`;
	}

	private showNewInstanceModal(): void {
		document.querySelector<NewInstanceModal>("new-instance-modal")!.showModal();
	}

	private async showSettingsModal(): Promise<void> {
		const { showSettingsModal } = await import("../../controllers/SettingsModal");
		showSettingsModal();
	}
}
