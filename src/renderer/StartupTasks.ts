import { ApplicationStore } from "./store";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import { InstanceController } from "./controllers/InstanceController";
import * as Render from "./Render";
import * as consoleUtils from "../universal/consoleUtils";

import Turbolinks from "turbolinks";

Turbolinks.start();

// turbolinks events
document.addEventListener("turbolinks:load", () => {
	// remove cache to prevent js from loading twice
	// FIXME: should work without clearing cache
	Turbolinks.clearCache();
	
	// update login status
	if (ApplicationStore.auth.get("loggedIn", false) == false) {
		Render.updateLoginStatus("logout");
	}
	else Render.updateLoginStatus("login");
});

// startup tasks (on application start)
$(() => {
	// update versions
	VersionsController.updateVersionMeta();

	// update auth
	AuthenticationController.refreshLogin();
});

// export modules
export { Render, ApplicationStore };
// export imported controllers to window
export { AuthenticationController, InstanceController };
