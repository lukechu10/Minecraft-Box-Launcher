import { Authentication } from "@xmcl/user";

import Store from "electron-store";

interface AuthStoreData extends Authentication{
	loggedIn: true,
}

class AuthStore extends Store<AuthStoreData | { loggedIn: false }> {
	public constructor() {
		super({
			name: "auth",
			defaults: {
				loggedIn: false
			}
		});
	}
}

export default new AuthStore();
