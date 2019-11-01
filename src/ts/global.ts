import * as store from "./store";
import { updateLoginStatus } from "./authentication";
import { updateVersionMeta } from "./instance";

// startup tasks
$(() => {
	if (store.auth.get("loggedIn", false) == false) {
		updateLoginStatus("logout");
	}
	else updateLoginStatus("login");

	// update versions
	updateVersionMeta();
});

// export modules
import * as Render from "./Render";
import * as auth from "./authentication";
import * as instances from "./instance";

export { Render, auth, store, instances };