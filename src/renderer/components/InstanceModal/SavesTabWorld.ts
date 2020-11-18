import { deserialize, TagType } from "@xmcl/nbt";
import fs from "fs-extra";
import { customElement, html, LitElement, property, PropertyValues, TemplateResult } from "lit-element";
import Long from "long";
import moment from "moment";
import path from "path";
import type { Instance } from "../../Instance";

class WorldVersion {
	@TagType(TagType.String)
	public Name = "";
	@TagType(TagType.Int)
	public ID = 0;
	@TagType(TagType.Int)
	public Snapshot = 0;
}

class WorldData {
	@TagType(TagType.String)
	public LevelName = "";
	@TagType(TagType.Double)
	public LastPlayed: Long = new Long(0);
	@TagType(WorldVersion)
	public Version: WorldVersion | undefined;
}

class World {
	@TagType(WorldData)
	public Data: WorldData | undefined;
}

async function readWorlds(savePath: string): Promise<WorldData[]> {
	const worlds: WorldData[] = [];
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
					const nbtData: World = await deserialize(fileBuffer);
					worlds.push(nbtData.Data!);
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
	@property({ type: Array }) private worlds: WorldData[] = [];

	protected render(): TemplateResult {
		const worldListElements: TemplateResult[] = [];

		for (const world of this.worlds) {
			const lastPlayed = moment(world.LastPlayed.toNumber());
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
		if (changedProperties.has("instance") && this.instance !== null) {
			// update world list
			this.refresh();
		}
	}

	public async refresh(): Promise<void> {
		const worldPath = path.join(this.instance!.savePath, "saves");

		this.worlds = await readWorlds(worldPath);
	}
}
