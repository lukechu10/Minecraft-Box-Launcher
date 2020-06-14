import { electron, ElectronApplication, ElectronPage } from "playwright-electron";

import path from "path";
import { expect } from "chai";

let electronApp: ElectronApplication = null;
const electronPath = require("electron");

describe("Sanity checks", function () {
	this.timeout(10000);

	beforeEach(async function () {
		// Before each test start Electron application.
		electronApp = await electron.launch(electronPath as unknown as string, {
			// args: [path.join(__dirname, '..')]  // loads index.js
			args: [".", "--dev"]
		});
	});

	afterEach(async function () {
		// After each test close Electron application.
		await electronApp.close();
	});

	it("has the correct window title", async function () {
		const page: ElectronPage = await electronApp.firstWindow();
		const title: string = await page.mainFrame().title();
		expect(title).to.equal("Minecraft Box");
	});
});
