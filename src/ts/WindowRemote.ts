import _ from "lodash";
import { remote } from "electron";
const BrowserWindow = remote.BrowserWindow;

interface WindowConstructorOptions extends Electron.BrowserWindowConstructorOptions {
	type: "file" | "url"
	path: string
}

// TODO: make inherit from Electron.BrowserWindow to provide full api
export default class Window {
	browser: Electron.BrowserWindow;
	private static defaultOpts: WindowConstructorOptions = {
		type: "url",
		path: "",
	};
	/**
	* Create a new window with properties
	*/
	constructor(opts?: WindowConstructorOptions | undefined) {
		const newOpts = _.defaultsDeep(opts, Window.defaultOpts);
		this.browser = new BrowserWindow(newOpts);
		// type
		if (newOpts.type == "file") {
			this.browser.loadFile(newOpts.path);
		}
		else if (newOpts.type == "url") {
			this.browser.loadURL(newOpts.path);
		}
	}
	show() {
		this.browser.show();
	}
	hide() {
		this.browser.hide();
	}
	setMenu(menu: Electron.Menu | null) {
		this.browser.setMenu(menu);
	}
}