import { ApplicationStore } from "./store";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import InstanceStore from "./store/InstanceStore";
import * as Render from "./Render";

import { shell } from "electron";

function showErrorToast(message: string) {
	// show toast with error message
	// @ts-ignore
	$("body").toast({
		class: "error",
		message: `<strong>An unexpected error occured</strong>:<br>${message}`,
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
}

process.on("uncaughtException", err => {
	showErrorToast(err.message);
	console.error(err);
});
window.addEventListener("unhandledrejection", event => {
	showErrorToast(event.reason);
	console.error(event.reason);
});

// startup tasks (on application start)
$(async () => {
	// update versions
	VersionsController.updateVersionMeta();

	// update auth
	try {
		await AuthenticationController.refreshLogin();
	}
	catch (err) {
		if (err !== "User is not logged in. Cannot refresh auth.")
			// pass on exception
			throw err;
			// else ignore
	}
});

// export modules
export { Render, ApplicationStore, InstanceStore };
// export imported controllers to window
export { AuthenticationController, VersionsController };
	
export * from "./components/InstanceList";
export * from "./components/UserStatus";
export * from "./components/InstanceInfoModal";
