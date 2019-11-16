import { ApplicationStore } from "../universal/store";
import { updateLoginStatus } from "./authentication";
import { VersionsController } from "./controllers/VersionsController";
import * as consoleUtils from "../universal/consoleUtils";

// startup tasks
$(() => {
	if (ApplicationStore.auth.get("loggedIn", false) == false) {
		updateLoginStatus("logout");
	}
	else updateLoginStatus("login");

	// update versions
	VersionsController.updateVersionMeta();

	ipcRenderer.on("update-instance-list", () => {
		consoleUtils.debug("Updating instance list");
		Render.instanceList();
	});
});

// export modules
import { Render } from "./Render";
import * as auth from "./authentication";
import { ipcRenderer } from "electron";

export { Render, auth, ApplicationStore };