import { readInfo, ServerInfo } from "@xmcl/server-info";
import fs from "fs-extra";
import path from "path";
import Instance from "../../Instance";

import { queryStatus, Status, QueryOptions } from "@xmcl/client";

export default class SavesTabServer extends HTMLDivElement {
	private instance: Instance | null = null;
	private servers: ServerInfo[] = [];
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		(this.getElementsByClassName("ui basic button")[0] as HTMLButtonElement).onclick = () => { this.render(); };
	}

	public setInstance(instance: Instance): void { this.instance = instance; }

	public async render(): Promise<void> {
		this.servers = []; // clear server list
		const tbody = this.getElementsByTagName("tbody")[0];
		// remove all children
		while (tbody.firstChild) {
			tbody.firstChild.remove();
		}
		// remove all error messages
		const errMsgs = this.getElementsByClassName("error message");
		Array.from(errMsgs).forEach(elem => { elem.remove(); });

		if (this.instance !== null) {
			this.getElementsByClassName("dimmer")[0].classList.add("active");
			const serverDatPath = path.join(this.instance.savePath, "servers.dat");
			if (await fs.pathExists(serverDatPath)) {
				const serverDatBuffer: Buffer = await fs.readFile(serverDatPath);
				const infos: ServerInfo[] = await readInfo(serverDatBuffer);
				for (const info of infos) {
					// add to table
					const rowNode: HTMLTableRowElement = document.createElement("tr");
					const nameNode: HTMLTableCellElement = document.createElement("td");
					nameNode.textContent = info.name;
					rowNode.appendChild(nameNode);
					const ipNode: HTMLTableCellElement = document.createElement("td");
					ipNode.textContent = info.ip;
					rowNode.appendChild(ipNode);
					const statusNode: HTMLTableCellElement = document.createElement("td");
					statusNode.classList.add("server-status-cell");
					statusNode.textContent = "Pinging...";
					rowNode.appendChild(statusNode);
					tbody.appendChild(rowNode);
				}
				this.servers = infos; // save servers to element state
				this.pingAllServers(); // get server status
			}
			else {
				// display no servers added message
				const errorNode: HTMLDivElement = document.createElement("div");
				errorNode.classList.add("ui", "error", "message", "bottom", "attached");
				errorNode.textContent = "You have not created any servers yet! Start playing to see your saved servers.";
				this.getElementsByTagName("table")[0].parentNode?.appendChild(errorNode);
			}
			this.getElementsByClassName("dimmer")[0].classList.remove("active");
		}
	}

	private async pingAllServers(): Promise<void> {
		const statusElements = this.querySelectorAll<HTMLTableCellElement>(".server-status-cell"); // 3rd row in server list
		for (let i = 0; i < this.servers.length; i++) {
			// ping server
			try {
				const serverData = { host: this.servers[i].ip };
				const rawStatusJson: Status = await queryStatus(serverData, {
					timeout: 4000,
					protocol: 578
				});
				statusElements[i].textContent = `${rawStatusJson.players.online} / ${rawStatusJson.players.max}`;
			}
			catch (e) {
				// set error
				console.warn("Error while pinging server:\n", e);
				statusElements[i].textContent = "Error";
				statusElements[i].classList.add("error");
			}
		}
	}
}

customElements.define("saves-tab-server", SavesTabServer, { extends: "div" });
