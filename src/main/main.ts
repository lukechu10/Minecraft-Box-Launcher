import "v8-compile-cache";

// Modules to control application life and create native browser window
import { app, Menu, BrowserWindow } from "electron";

import debug from "electron-debug";

import { MainWindow } from "./MainWindow";

debug({
	showDevTools: false
});

const WindowList: Map<string, BrowserWindow | null> = new Map();

if (!process.argv.includes("--dev")) // show application menu only if flag --dev is passed as 3rd argument
	Menu.setApplicationMenu(null); // only show menu in dev

function createWindow(): void {
	// Create the browser window.
	WindowList.set("main", new MainWindow());

	// Emitted when the window is closed.
	WindowList.get("main")?.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		WindowList.set("main", null);
	});

	WindowList.get("main")?.webContents.on("new-window", event => event.preventDefault());
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
}
else {
	app.on("second-instance", () => {
		// Someone tried to run a second instance, we should focus our window.
		if (WindowList.get("main")?.isMinimized()) WindowList.get("main")?.restore();
		WindowList.get("main")?.focus();
	});

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on("ready", () => {
		createWindow();
	});
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (WindowList.get("main") === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

