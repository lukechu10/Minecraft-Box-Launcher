import chai, { should } from "chai";
should();
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import fs from "fs-extra";
import _ from "lodash";
import path from "path";
import { electron, ElectronApplication, ElectronPage } from "playwright-electron";
import { v4 as uuidv4 } from "uuid";

let electronApp: ElectronApplication = null;
const electronPath = require("electron");

let page: ElectronPage;

before(async () => {
	// before each test start Electron application.
	electronApp = await electron.launch(electronPath as unknown as string, {
		// args: [path.join(__dirname, '..')]  // loads index.js
		args: [".", "--dev", process.env.GITPOD_HOST === "https://gitpod.io" ? "--no-sandbox" : ""] // run without sandboxing if using gitpod]
	});

	page = await electronApp.firstWindow(); // wait for window to load
});

after(async () => {
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

describe("Window", function () {
	this.timeout(10000);

	it("has the correct window title", async () => {
		const title: string = await page.mainFrame().title();
		title.should.equal("Minecraft Box");
	});

	it("starts on the instance list page", async () => {
		const header = await page.$("#content > div > h1");
		header.textContent().should.eventually.equal("Instances");
	});

	it("can navigate to home page", async () => {
		await page.click("#app-navbar > .item[href='./home.html']");

		const header = await page.waitForSelector("#content > div > h1 >> text='Home'", { timeout: 1000 });
		header.textContent().should.eventually.equal("Home");
	});

	it("can navigate to news page", async () => {
		await page.click("#app-navbar > .item[href='./news.html']");

		const header = await page.waitForSelector("#content > div > h1 >> text='News'", { timeout: 1000 });
		header.textContent().should.eventually.equal("News");
	});

	it("can open account modal", async () => {
		await page.click("#app-navbar > #account-modal-link");

		await page.waitForSelector("#modal-account.ui.modal.visible", { timeout: 2000 });
	});
});
