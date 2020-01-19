import { ApplicationStore } from "./store";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import { InstanceController } from "./controllers/InstanceController";
import * as Render from "./Render";

// turbolinks events
document.addEventListener("turbolinks:load", () => {
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
