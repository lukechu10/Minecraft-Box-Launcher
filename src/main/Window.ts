import _ from "lodash";
import { BrowserWindow } from "electron";

export interface WindowConstructorOptions extends Electron.BrowserWindowConstructorOptions {
	type: "file" | "url"
	path: string
}

// TODO: Change to Proxy for BrowserWindow to set this.on("closed", () => { browser =  null; })) automatically
export default class Window extends BrowserWindow {
	private static defaultOpts: WindowConstructorOptions = {
		type: "url",
		path: ""
	};
	/**
	* Create a new window with properties
	*/
	constructor(opts?: WindowConstructorOptions | undefined) {
		const newOpts = _.defaultsDeep(opts, Window.defaultOpts);
		super(newOpts);
		// type
		if (newOpts.type == "file") {
			console.log(newOpts.path)

			this.loadFile(newOpts.path);
		}
		else if (newOpts.type == "url") {
			this.loadURL(newOpts.path);
		}
	}
}