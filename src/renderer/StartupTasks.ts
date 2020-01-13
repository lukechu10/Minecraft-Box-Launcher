import { ApplicationStore } from "./store";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import { InstanceController } from "./controllers/InstanceController";
import * as Render from "./Render";
import * as consoleUtils from "../universal/consoleUtils";

// startup tasks
$(() => {
	if (ApplicationStore.auth.get("loggedIn", false) == false) {
		Render.updateLoginStatus("logout");
	}
	else Render.updateLoginStatus("login");

	// update versions
	VersionsController.updateVersionMeta();

	// update auth
	AuthenticationController.refreshLogin();
});

// export modules
export { Render, ApplicationStore };
// export imported controllers to window
export { AuthenticationController, InstanceController };
