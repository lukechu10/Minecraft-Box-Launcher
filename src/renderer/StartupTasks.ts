import { ApplicationStore } from "./store";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import { InstanceController } from "./controllers/InstanceController";
import * as Render from "./Render";

import { shell } from "electron";

// turbolinks events
document.addEventListener("turbolinks:load", () => {
	// update login status
	if (ApplicationStore.auth.get("loggedIn", false) == false) {
		Render.updateLoginStatus("logout");
	}
	else Render.updateLoginStatus("login");
});

window.addEventListener("unhandledrejection", (event) => {
	// show toast with error message
	// @ts-ignore
	$("body").toast({
		class: "error",
		message: `<strong>An unexpected error occured</strong>:<br>${event.reason}`,
		displayTime: 0,
		classActions: "top attached",
		actions: [{
			text: "Report issue",
			class: "yellow",
			click: () => {
				shell.openExternal("https://github.com/lukechu10/Minecraft-Box-Launcher/issues/new/choose");
			}
		}, {
			text: "Ignore",
			class: "orange"
		}]
	});
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
