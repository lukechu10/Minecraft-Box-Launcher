import { readInfo, ServerInfo } from "@xmcl/server-info";
import fs from "fs-extra";
import path from "path";
import Instance from "../../Instance";

export default class SavesTabServer extends HTMLDivElement {
	private instance: Instance | null = null;
	public constructor() {
		super();
	}

	public connectedCallback(): void { }

	public setInstance(instance: Instance): void { this.instance = instance; }

	public async render(): Promise<void> {
		if (this.instance !== null) {
			const serverDatPath = path.join(Instance.MinecraftSavePath(this.instance.name), "servers.dat");
			if (await fs.pathExists(serverDatPath)) {
				const serverDatBuffer: Buffer = fs.readFileSync(serverDatPath);
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
					this.getElementsByTagName("tbody")[0].appendChild(rowNode);
				}
			}
			else {
				// display no servers added message
				const errorNode: HTMLDivElement = document.createElement("div");
				errorNode.classList.add("ui", "error", "message", "bottom", "attached");
				errorNode.textContent = "You have not created any servers yet! Start playing to see your saved servers.";
				this.getElementsByTagName("table")[0].parentNode?.appendChild(errorNode);
			}
		}
	}
}

customElements.define("saves-tab-server", SavesTabServer, { extends: "div" });
