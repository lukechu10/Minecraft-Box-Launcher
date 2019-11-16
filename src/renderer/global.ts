import { ApplicationStore } from "../universal/store";
import { updateLoginStatus } from "./authentication";
import { updateVersionMeta } from "./instance";
import * as consoleUtils from "../universal/consoleUtils";

// startup tasks
$(() => {
	if (ApplicationStore.auth.get("loggedIn", false) == false) {
		updateLoginStatus("logout");
	}
	else updateLoginStatus("login");

	// update versions
	updateVersionMeta();

	ipcRenderer.on("update-instance-list", () => {
		consoleUtils.debug("Updating instance list");
		Render.instanceList();
	});
});

// export modules
import { Render } from "./Render";
import * as auth from "./authentication";
import * as instances from "./instance";
import { ipcRenderer } from "electron";
import { InstanceController } from "./controllers/InstanceController";

export { Render, auth, ApplicationStore as store, instances, InstanceController };