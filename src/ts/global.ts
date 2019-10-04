import * as store from "./store";
import { login, updateLoginStatus } from "./authentication";

$(() => {
	if (store.auth.get("loggedIn", false) == false) {
		updateLoginStatus("logout");
	}
	else updateLoginStatus("login");
});