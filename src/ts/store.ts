import Store = require("electron-store");
// import Auth from "@xmcl/auth";


export var instances: Store = new Store({
	name: "instances",
	defaults: {
		instances: [
            
		]
	}
});

export var installed: Store = new Store({
	name: "installed",
	defaults: {
		installed: [

		]
	}
});

export var auth: Store = new Store({
	name: "auth",
	defaults: {
		loggedIn: false
	}
});

/**
 * Cached versions meta
 */
export var versionsMetaCache: Store = new Store({
	name: "versionsMetaCache",
	defaults: {
		versions: []
	}
});