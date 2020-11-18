// Modules to control application life and create native browser window
import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";

const IS_DEBUG = process.argv.includes("--dev");
if (!IS_DEBUG) Menu.setApplicationMenu(null); // do not show menu in debug mode

const USE_DEV_SERVER = process.argv.includes("--use-dev-server");

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
        },
        backgroundColor: "#FFF",
        title: "Minecraft Box Launcher",
    });

    // and load the index.html of the app.
    if (USE_DEV_SERVER) {
        // connect to snowpack dev server on port 8080
        mainWindow.loadURL("http://localhost:8080/");
    } else {
        mainWindow.loadFile(path.join(__dirname, "../index.html"));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // if (IS_DEBUG) {
    //     installExtension(
    //         "ckolcbmkjpjmangdbmnkpjigpkddpogn" /* svelte devtools */
    //     )
    //         .then((name) => console.log(`Added Extension:  ${name}`))
    //         .catch((err) => console.log("An error occurred: ", err));
    // }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
