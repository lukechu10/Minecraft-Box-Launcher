import * as store from "./store";
import { login, updateLoginStatus } from "./authentication";
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