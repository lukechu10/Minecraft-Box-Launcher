import { ApplicationStore } from "./store";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import InstanceListStore from "./store/InstanceListStore";
import * as Render from "./Render";
import { showErrorToast } from "./util";

import "./components/AuthModal";

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
export { Render, ApplicationStore, InstanceListStore };
// export imported controllers to window
export { AuthenticationController, VersionsController };

export * from "./components/InstanceList";
export * from "./components/UserStatus";
