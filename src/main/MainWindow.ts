import path from "path";
import { BrowserWindow } from "electron";

const MainWindowOptions: Electron.BrowserWindowConstructorOptions = {
	width: 800,
	height: 600,
	title: "Minecraft Box",
	webPreferences: {
		nodeIntegration: true,
		sandbox: false
	},
	icon: path.join(__dirname, "./build/icon.png")
};

export class MainWindow extends BrowserWindow {
	constructor() {
		super(MainWindowOptions);
		// load file
		this.loadFile(path.join(__dirname, "../../views/", "instances.html"));
	}
}
