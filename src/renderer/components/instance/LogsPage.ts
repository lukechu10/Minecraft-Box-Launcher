import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type { Instance } from "../../Instance";

@customElement("logs-page")
export class LogsPage extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;

	protected render(): TemplateResult {
		if (this.instance !== null) {
			const msgTemplates: TemplateResult[] = [];
			if (this.instance.process?.log !== undefined) {
				for (const msg of this.instance.process?.log) {
					msgTemplates.push(html`
						<div class="InstanceLogs-out ${msg.type === "err" ? "InstanceLogs-error" : ""}">${msg.message}</div>
					`);
				}
			}

			return html`
				<div class="ui header">Logs</div>
				${msgTemplates.length > 0 ? html`
					${msgTemplates}
				` : html`
					<p>Launch the instance to see the game log.</p>
				`}
			`;
		}
		else {
			return html``;
		}
	}
}
