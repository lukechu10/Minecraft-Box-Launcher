import { deserialize } from "@xmcl/nbt";
import fs from "fs-extra";
import { customElement, html, LitElement, property, TemplateResult, PropertyValues } from "lit-element";
import moment from "moment";
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

@customElement("saves-tab-world")
export default class SavesTabWorld extends LitElement {
	protected createRenderRoot(): this { return this; }

	@property({ type: Object }) public instance: Instance | null = null;
	@property({ type: Array }) private worlds: any[] = [];

	// public connectedCallback(): void {
	// 	// (this.getElementsByClassName("ui basic button")[0] as HTMLButtonElement).onclick = (): void => { this.render(); };
	// }

	// public setInstance(instance: Instance): void { this.instance = instance; }

	protected render(): TemplateResult {
		const worldListElements: any[] = [];

		for (const world of this.worlds) {
			const lastPlayed = moment(world.LastPlayed?.toNumber());
			worldListElements.push(html`
				<tr>
					<td>${world.LevelName}</td>
					<td>${lastPlayed.calendar()} (${lastPlayed.fromNow()})</td>
					<td>${world.Version?.Name ?? "Unknown"}</td>
				</tr>
			`);
		}

		return html`
			<button class="ui basic button" @click="${this.refresh}">Refresh</button>
			<table class="ui celled table">
				<thead>
					<tr>
						<th>World Name</th>
						<th>Last Played</th>
						<th>Version</th>
					</tr>
				</thead>
				<tbody>${worldListElements}</tbody>
			</table>
			${this.worlds.length === 0 ? html`
				<div class="ui error message bottom attached">You have not created any worlds yet! Start playing to see your saved worlds.</div>
			` : ""}
		`;
	}

	protected updated(changedProperties: PropertyValues): void {
		if(changedProperties.has("instance") && this.instance !== null) {
			// update world list
			this.refresh();
		}
	}

	public async refresh(): Promise<void> {
		const worldPath = path.join(this.instance!.savePath, "saves");

		const worlds: any[] = await readWorlds(worldPath);
		this.worlds = worlds;
	}
}
