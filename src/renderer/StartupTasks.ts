import { AuthenticationController } from "./controllers/AuthenticationController";
import { updateVersionMeta } from "./controllers/VersionsController";
import { ApplicationStore } from "./store";
import AuthStore from "./store/AuthStore";
import InstanceListStore from "./store/InstanceListStore";
import { showErrorToast } from "./util";
import "./components/NewInstanceModal";
import "./controllers/SettingsModal";

window.addEventListener("error", event => {
	showErrorToast(event.message);
	console.error(event.message);
});

window.addEventListener("load", () => {
	import(/* webpackChunkName: "turbolinks" */ "./TurbolinksController"); // lazy load turbolinks once initial render has finished
});

// startup tasks (on application start)
$(async () => {
	// update versions
	updateVersionMeta();

	// update auth
	try {
		await AuthenticationController.refreshLogin();
	}
	catch (err) {
		/* istanbul ignore else */
		if (err.message !== "User is not logged in. Cannot refresh auth.")
			// pass on exception
			throw err;
		// else ignore
	}
});

// export modules
export * from "./components/AccountModal";
export * from "./components/InstanceList";
export * from "./components/TaskProgress";
export { ApplicationStore, AuthStore, InstanceListStore };
// export imported controllers to window
export { AuthenticationController };

