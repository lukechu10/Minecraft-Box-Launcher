import { expect } from "chai";
import fs from "fs-extra";
import _ from "lodash";
import path from "path";
import { electron, ElectronApplication, ElectronPage } from "playwright-electron";
import { v4 as uuidv4 } from "uuid";

let electronApp: ElectronApplication = null;
const electronPath = require("electron");

describe("Sanity checks", function () {
	this.timeout(10000);

	beforeEach(async function () {
		// before each test start Electron application.
		electronApp = await electron.launch(electronPath as unknown as string, {
			// args: [path.join(__dirname, '..')]  // loads index.js
			args: [".", "--dev"]
		});
	});

	afterEach(async function () {
		// attempt to collect coverage object from global variable in renderer process
		const coverageReport: object | undefined = await (await electronApp.firstWindow()).evaluate(() => (window as any).__coverage__);

		// write coverage report to coverage dir
		if (!_.isEmpty(coverageReport)) {
			// generate file names
			const NYC_OUTPUT_BASE = path.resolve(".nyc_output");
			const NYC_OUTPUT_DEST = path.resolve(NYC_OUTPUT_BASE, `${uuidv4()}.json`);

			await fs.mkdirp(NYC_OUTPUT_BASE); // make sure dir exists
			await fs.writeJSON(NYC_OUTPUT_DEST, coverageReport, {
				encoding: "utf8"
			});
		}
		// after each test close Electron application.
		await electronApp.close();
	});

	it("has the correct window title", async function () {
		const page: ElectronPage = await electronApp.firstWindow();
		const title: string = await page.mainFrame().title();
		expect(title).to.equal("Minecraft Box");
	});
});
