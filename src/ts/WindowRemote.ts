import _ from "lodash";
import { remote } from 'electron';
const BrowserWindow = remote.BrowserWindow;

interface WindowConstructorOptions extends Electron.BrowserWindowConstructorOptions {
	type: "file" | "url"
	path: string
}

export default class Window extends BrowserWindow {
	private static defaultOpts: WindowConstructorOptions = {
		type: "url",
		path: "",
	}
	/**
	* Create a new window with properties
	*/
	constructor(opts?: WindowConstructorOptions | undefined) {
		const newOpts = _.defaultsDeep(opts, Window.defaultOpts);
		super(newOpts);
		// type
		if (newOpts.type == "file") {
			this.loadFile(newOpts.path);
		}
		else if (newOpts.type == "url") {
			this.loadURL(newOpts.path);
		}
	}
}