import { LitElement, customElement, property, TemplateResult, html } from "lit-element";
import { InstanceProcess } from "../../store/InstanceData";
import Instance from "../../Instance";

@customElement("instance-logs-modal")
export default class Logs extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public processLogs: InstanceProcess | null = null;

	protected render(): TemplateResult {
		let template: TemplateResult | TemplateResult[];
		if (this.processLogs === null)
			template = html`Launch the game to see the log`;

		else {
			template = [];
			for (const logEntry of this.processLogs.log) {
				template.push(html`
					<div class="InstanceLogs-out ${logEntry.type === "err" ? "InstanceLogs-error" : ""}">
						${logEntry.message}
					</div>
				`);
			}
		}

		return html`
			<div class="header">Logs</div>
			<div class="scrolling content">
				<p>${template}</p>
			</div>
		`;
	}

	public showModal(instance: Instance): void {
		this.processLogs = instance.process ?? null;

		const changeCallback = async (): Promise<void> => {
			await this.requestUpdate();
			// scroll to bottom of log
			const scrolllingContent = this.querySelector(".scrolling.content")!;
			scrolllingContent.scroll(0, scrolllingContent.scrollHeight);
		};

		this.processLogs?.on("data", changeCallback);

		$(this).modal({
			onShow: async () => {
				await this.requestUpdate();
				// scroll to bottom of log
				const scrolllingContent = this.querySelector(".scrolling.content")!;
				scrolllingContent.scroll(0, scrolllingContent.scrollHeight);
			},
			onHidden: () => {
				// disable event listener
				this.processLogs?.off("data", changeCallback);
			}
		}).modal("show");
	}
}
