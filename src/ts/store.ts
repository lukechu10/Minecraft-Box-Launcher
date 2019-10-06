import ElectronStore = require("electron-store");
// import Auth from "@xmcl/auth";


export var instances: ElectronStore = new ElectronStore({
	name: "instances",
	defaults: {
		instances: [
            
		]
	}
});

export var auth: ElectronStore = new ElectronStore({
	name: "auth",
	defaults: {
		loggedIn: false
	}
});

/**
 * Cached versions meta
 */
export var versionsMetaCache: ElectronStore = new ElectronStore({
	name: "versionsMetaCache",
	defaults: {
		versions: []
	}
});