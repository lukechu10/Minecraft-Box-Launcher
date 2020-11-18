import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import type { Instance } from "../../Instance";
import { InstanceProcess } from "../../store/InstanceData";

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
			<div class="header">
				Logs
				${this.processLogs?.isRunning ? html`
					<label class="ui green label" style="float: right">Running...</label>
				` : html`
					<label class="ui red label" style="float: right">Stopped</label>
				`}
			</div>
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
			const scrollingContent = this.querySelector(".scrolling.content")!;
			scrollingContent.scroll(0, scrollingContent.scrollHeight);
		};

		this.processLogs?.on("data", changeCallback).on("close", changeCallback);

		$(this).modal({
			onShow: async () => {
				await this.requestUpdate();
				// scroll to bottom of log
				const scrollingContent = this.querySelector(".scrolling.content")!;
				scrollingContent.scroll(0, scrollingContent.scrollHeight);
			},
			onHidden: () => {
				// disable event listener
				this.processLogs?.off("data", changeCallback).off("close", changeCallback);
			}
		}).modal("show");
	}
}
