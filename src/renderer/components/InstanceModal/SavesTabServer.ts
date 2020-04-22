import { readInfo, ServerInfo } from "@xmcl/server-info";
import fs from "fs-extra";
import path from "path";
import Instance from "../../Instance";

import { queryStatus, Status, QueryOptions } from "@xmcl/client";
import { LitElement, customElement, TemplateResult, html, property } from "lit-element";
import { until } from "lit-html/directives/until";

@customElement("saves-tab-server")
export default class SavesTabServer extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;
	@property({ type: Array }) private servers: ServerInfo[] = [];

	public setInstance(instance: Instance): void { this.instance = instance; }

	protected render(): TemplateResult {
		const serverListElements: TemplateResult[] = [];

		for (const server of this.servers) {
			const pingContext = this.pingServerResult(server.ip);

			serverListElements.push(html`
				<tr>
					<td>${server.name}</td>
					<td>${server.ip}</td>
					${until(pingContext, html`<td>Pinging...</td>`)}
				</tr>
			`);
		}

		return html`
			<button class="ui basic button" @click="${this.refreshServers}">Refresh</button>
			<table class="ui celled table">
				<thead>
					<tr>
						<th class="six wide">Server name</th>
						<th class="six wide">IP Address</th>
						<th class="four wide">Status</th>
					</tr>
				</thead>
				<tbody>${serverListElements}</tbody>
				<tfoot></tfoot>
			</table>
			${this.servers.length === 0 ? html`
				<div class="ui error message bottom attached">You have not created any servers yet! Start playing to see your saved servers.</div>
			` : ""}
		`;
	}

	public async refreshServers(): Promise<void> {
		if (this.instance !== null) {
			const serverDatPath = path.join(this.instance.savePath, "servers.dat");

			if (await fs.pathExists(serverDatPath)) {
				const serverDatBuffer: Buffer = await fs.readFile(serverDatPath);
				const infos: ServerInfo[] = await readInfo(serverDatBuffer);

				this.servers = infos; // update state with new data
			}
			else {
				this.servers = []; // erase all servers and trigger update
			}

			this.requestUpdate();
		}
	}

	private async pingServerResult(host: string): Promise<TemplateResult> {
		try {
			const serverData = { host };
			const options: QueryOptions = {
				timeout: 4000,
				protocol: 578
			};
			const rawStatusJson: Status = await queryStatus(serverData, options);
			return html`
				<td>${rawStatusJson.players.online} / ${rawStatusJson.players.max}</td>
			`;
		}
		catch (e) {
			console.warn("Error while pinging server:\n", e);
			return html`
				<td class="error">Error</td>
			`;
		}
	}
}
