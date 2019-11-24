import { ApplicationStore } from "../universal/store";
import { Render } from "./Render";

import { VersionsController } from "./controllers/VersionsController";
import * as consoleUtils from "../universal/consoleUtils";

// startup tasks
$(() => {
	if (ApplicationStore.auth.get("loggedIn", false) == false) {
		Render.updateLoginStatus("logout");
	}
	else Render.updateLoginStatus("login");

	// update versions
	VersionsController.updateVersionMeta();

	ipcRenderer.on("update-instance-list", () => {
		consoleUtils.debug("Updating instance list");
		Render.instanceList();
	});

	// update auth
	AuthenticationController.refreshLogin();
});

// export modules
import { ipcRenderer } from "electron";
import { AuthenticationController } from './controllers/AuthenticationController';
export { Render, ApplicationStore };