"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElectronStore = require("electron-store");
exports.instances = new ElectronStore({
    name: "instances",
    defaults: {
        instances: []
    }
});
exports.auth = new ElectronStore({
    name: "auth",
    defaults: {
        loggedIn: false
    }
});
//# sourceMappingURL=store.js.map