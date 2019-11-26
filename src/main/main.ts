import "v8-compile-cache";

// Modules to control application life and create native browser window
import { app, ipcMain } from "electron";
import * as path from "path";

import debug from "electron-debug";

import * as consoleUtils from "../universal/consoleUtils";
import Window, { WindowConstructorOptions } from "./Window";

debug({
	showDevTools: false
});

class WindowList {
	main: Window | null = null;
	newInstance: Window | null = null;
	[index: string]: Window | null;
}

class WindowOptsList {
	main: WindowConstructorOptions = {
		type: "file",
		path: path.join(__dirname, "../../views/", "instances.html"),
		width: 800,
		height: 600,
		title: "Minecraft Box",
		webPreferences: {
			nodeIntegration: true,
			sandbox: false
		}
	};
	newInstance: WindowConstructorOptions = {
		type: "file",
		path: path.join(__dirname, "../../views/", "newInstance.html"),
		title: "New Instance",
		webPreferences: {
			nodeIntegration: true
		}
	};
	[index: string]: WindowConstructorOptions;
}
let windows: WindowList = new WindowList();
const windowsOpts: WindowOptsList = new WindowOptsList();

function createWindow() {
	// Create the browser window.
	windows.main = new Window(windowsOpts.main);

	// Menu.setApplicationMenu(null);
	// Emitted when the window is closed.
	windows.main.on("closed", function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		windows.main = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (windows.main === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("showWindow-newInstance", (event: Electron.IpcMainEvent) => {
	if (windows.newInstance === null) {
		windows.newInstance = new Window(windowsOpts.newInstance);
		consoleUtils.debug("Creating window newInstance");
		// create on closed event
		windows.newInstance.once("closed", (event: Electron.Event) => {
			windows.newInstance = null;
			// keep reference for future use
		});
	}
	windows.newInstance.show();
	consoleUtils.debug("Showing new instance window");
	event.returnValue = "success";
});

// change to instance list from different window
ipcMain.on("new-instance", (event: Electron.IpcMainEvent) => {
	consoleUtils.debug("Updating instance list");
	if (windows.main !== null)
		windows.main.webContents.send("update-instance-list");
	event.returnValue = "success";
});