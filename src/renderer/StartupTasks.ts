import { ApplicationStore } from "../universal/store";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import { Render } from "./Render";
import { ipcRenderer } from "electron";
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
export { Render, ApplicationStore };
// export controllers to window
export { AuthenticationController };
