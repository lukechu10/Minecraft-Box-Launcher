import path from "path";

import { Installer } from "@xmcl/installer";
import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";

import { remote, app as mainApp, App } from "electron";
import { ChildProcess } from 'child_process';
import { LaunchController } from '../../renderer/controllers/LaunchController';
import { InstanceData } from "./InstanceData";

let app: App;
if (process && process.type == "renderer") {
	app = remote.app;
}
else {
	app = mainApp;
}

export class InstanceSave extends InstanceData implements Installer.VersionMeta {
	/**
	 * Install this version
	 */
	public async install(): Promise<void> {
		const location: MinecraftLocation = new MinecraftFolder(path.join(app.getPath("userData"), "./game/"));
		const res = await Installer.install("client", this, location);
		this.installed = true;
	}

	/**
	 * Launches this version
	 */
	public async launch(): Promise<ChildProcess> {
		const spawn = LaunchController.launch(this);
		// update last played
		this.lastPlayed = new Date().toISOString();
		return spawn;
	}
}
