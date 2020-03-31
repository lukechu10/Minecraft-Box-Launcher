import { deserialize } from "@xmcl/nbt";

import fs from "fs-extra";
import path from "path";
import Instance from "../../Instance";

async function readWorlds(savePath: string): Promise<object[]> {
	const worlds: object[] = [];
	// list dir in path
	if (await fs.pathExists(savePath)) {
		const dirs: string[] = await fs.readdir(savePath);
		for (const dir of dirs) {
			// make sure dir is a folder
			if ((await fs.stat(path.join(savePath, dir))).isDirectory()) {
				// read level.dat
				const levelPath = path.join(savePath, dir, "level.dat");
				if (await fs.pathExists(levelPath)) {
					// read nbt file
					const fileBuffer = await fs.readFile(levelPath);
					const nbtData: any = await deserialize(fileBuffer);
					worlds.push(nbtData.Data as object);
				}
			}
		}
	}
	return worlds;
}

export default class SavesTabWorld extends HTMLDivElement {
	private instance: Instance | null = null;
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		(this.getElementsByClassName("ui basic button")[0] as HTMLButtonElement).onclick = () => { this.render(); };
	}

	public setInstance(instance: Instance): void { this.instance = instance; }

	public async render(): Promise<void> {
		const tbody = this.getElementsByTagName("tbody")[0];
		// remove all children
		while (tbody.firstChild) {
			tbody.firstChild.remove();
		}
		// remove all error messages
		const errMsgs = this.getElementsByClassName("error message");
		Array.from(errMsgs).forEach(elem => { elem.remove(); });

		if (this.instance !== null) {
			// this.getElementsByClassName("dimmer")[0].classList.add("active");
			const worldPath = path.join(this.instance.savePath, "saves");
			const worlds: any[] = await readWorlds(worldPath);
			if (worlds.length !== 0) {
				for (const world of worlds) {
					// add to table
					const rowNode: HTMLTableRowElement = document.createElement("tr");
					const nameNode: HTMLTableCellElement = document.createElement("td");
					nameNode.textContent = world.LevelName;
					rowNode.appendChild(nameNode);
					const lastPlayed: HTMLTableCellElement = document.createElement("td");
					lastPlayed.textContent = new Date(world.LastPlayed.toNumber()).toDateString();
					rowNode.appendChild(lastPlayed);
					const versionNode: HTMLTableCellElement = document.createElement("td");
					versionNode.textContent = world.Version.Name;
					rowNode.appendChild(versionNode);
					tbody.appendChild(rowNode);
				}
			}
			else {
				// display no servers added message
				const errorNode: HTMLDivElement = document.createElement("div");
				errorNode.classList.add("ui", "error", "message", "bottom", "attached");
				errorNode.textContent = "You have not created any worlds yet! Start playing to see your saved worlds.";
				this.getElementsByTagName("table")[0].parentNode?.appendChild(errorNode);
			}
			// this.getElementsByClassName("dimmer")[0].classList.remove("active");
		}
	}
}

customElements.define("saves-tab-world", SavesTabWorld, { extends: "div" });
