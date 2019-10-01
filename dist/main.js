"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
let mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        title: "Minecraft Box",
        webPreferences: {
            nodeIntegration: true,
            sandbox: false
        }
    });
    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join("../views/", "index.html"));
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", function () {
    if (mainWindow === null)
        createWindow();
});
//# sourceMappingURL=main.js.map