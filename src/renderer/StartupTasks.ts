import "./components/AuthModal";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { VersionsController } from "./controllers/VersionsController";
import * as Render from "./Render";
import { ApplicationStore } from "./store";
import AuthStore from "./store/AuthStore";
import InstanceListStore from "./store/InstanceListStore";
import { showErrorToast } from "./util";


process.on("uncaughtException", err => {
	showErrorToast(err.message);
	console.error(err);
});
window.addEventListener("unhandledrejection", event => {
	showErrorToast(event.reason);
	console.error(event.reason);
});

window.addEventListener("load", () => {
	import(/* webpackChunkName: "turbolinks" */ "./turbolinks"); // lazy load turbolinks once initial render has finished
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
export { Render, ApplicationStore, AuthStore, InstanceListStore };
// export imported controllers to window
export { AuthenticationController, VersionsController };


