import "v8-compile-cache";

// Modules to control application life and create native browser window
import { app, ipcMain, BrowserWindow, Menu } from "electron";
import * as path from "path";

import debug from "electron-debug";

import * as consoleUtils from "./consoleUtils";
import Window, { WindowConstructorOptions } from "./Window";

debug();

class WindowList {
	main: Window | null = null;
	newInstance: Window | null = null;
	[index: string]: Window | null;
}

class WindowOptsList {
	main: WindowConstructorOptions = {
		type: "file",
		path: path.join(__dirname, "../static/views/", "instances.html"),
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
		path: path.join(__dirname, "../static/views/", "newInstance.html"),
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

// show window
ipcMain.on("show-window", (event: Electron.IpcMainEvent, ...args) => {
	if (args === undefined || typeof args[0] !== "string") {
		console.error("Argument args[0] must be of type string. Ignorring");
		event.returnValue = { message: "Argument args[0] must be of type string. Ignorring" };
	}
	else {
		try {
			const windowName: string = args[0];
			if (windows[windowName] !== undefined) {
				// get window and show
				if (windows[windowName] === null) {
					// create new window
					consoleUtils.debug(`Creating and showing window ${windowName}`);
					// construct new window with options
					windows[windowName] = new Window(windowsOpts[windowName]);
					(windows[windowName] as Window).show();
					(windows[windowName] as Window).on("closed", (event: Electron.Event) => {
						// keep a reference of the window for future uses
						windows[windowName] = null;
					});
					event.returnValue = { message: `Window ${windowName} created and shown` };
				}
				else {
					consoleUtils.debug(`Showing window ${windowName}`);
					(windows[windowName] as Window).show();
					event.returnValue = { message: `Window ${windowName} shown` };
				}
			}
			else {
				console.error(`Window ${windowName} not found`);
				event.returnValue = { message: `Window ${windowName} not found` };
			}
		}
		catch (err) {
			consoleUtils.debug(`Error: ${err}`);
			event.returnValue = { message: err };
		}
	}
});

// change to instance list from different window
ipcMain.on("new-instance", (event: Electron.IpcMainEvent) => {
	consoleUtils.debug("Updating instance list");
	if (windows.main !== null)
		windows.main.webContents.send("update-instance-list");
	event.returnValue = "success";
});