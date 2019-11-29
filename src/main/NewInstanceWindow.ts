import path from "path";
import { BrowserWindow } from 'electron';

const MainWindowOptions: Electron.BrowserWindowConstructorOptions = {
	width: 800, // TODO: change dimensions so the window will not be exactly over main window
	height: 600,
	title: "New Instance",
	webPreferences: {
		nodeIntegration: true,
		sandbox: false
	}
}

export class MainWindow extends BrowserWindow {
	constructor() {
		super(MainWindowOptions);
		// load file
		this.loadFile(path.join(__dirname, "../../views/", "newInstance.html"));
	}
}