import "v8-compile-cache";

// Modules to control application life and create native browser window
import { app, Menu, BrowserWindow } from "electron";

import debug from "electron-debug";
import path from "path";

debug({
	showDevTools: false
});
let mainWindow: BrowserWindow | null;

if (!process.argv.includes("--dev")) // show application menu only if flag --dev is passed as 3rd argument
	Menu.setApplicationMenu(null); // only show menu in dev

function createWindow(): void {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		title: "Minecraft Box",
		webPreferences: {
			nodeIntegration: true,
			sandbox: false
		},
		// icon: path.join(__dirname, "./build/icon.png")
	});
	mainWindow.loadFile(path.join(__dirname, "../../", "instances.html"));

	// Emitted when the window is closed.
	mainWindow?.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	mainWindow?.webContents.on("new-window", event => event.preventDefault());
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
}
else {
	app.on("second-instance", () => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow?.isMinimized()) mainWindow?.restore();
		mainWindow?.focus();
	});

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.whenReady().then(createWindow);
}

app.allowRendererProcessReuse = false;

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow();
});
