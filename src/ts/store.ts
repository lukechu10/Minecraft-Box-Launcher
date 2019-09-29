import ElectronStore = require("electron-store");


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