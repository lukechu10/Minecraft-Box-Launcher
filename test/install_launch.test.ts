import chai, { should } from "chai";
import chaiAsPromised from "chai-as-promised";
import fs from "fs-extra";
import path from "path";
import type { ElectronApplication, ElectronPage } from "playwright-electron";
import { afterSetup, beforeSetup } from "./setup";

should();
chai.use(chaiAsPromised);
describe("Instances Install and Launch", function () {
	this.timeout("600s"); // 10 min max

	let page: ElectronPage;
	let electronApp: ElectronApplication;

	before(async () => {
		this.timeout(5000);
		await fs.mkdirp("./test/temp/");
		// overwrite mock instances.test.ts
		await fs.copyFile(path.resolve("./test/mock/instances.json"), path.join("./test/temp/", "instances.json"));
		// overwrite mock versionsMetaCache.json
		await fs.copyFile(path.resolve("./test/mock/versionsMetaCache.json"), path.join("./test/temp/", "versionsMetaCache.json"));

		const setup = (await beforeSetup());
		page = setup.page;
		electronApp = setup.electronApp;		
	});

	after(async () => {
		return afterSetup(electronApp);
	});

	it("should install the instance '1.8.9 Test' with version 'vanilla-release 1.8.9'", async () => {
		await page.hover("instance-list instance-list-item"); // hover over instance-list-item to make install button appear
		await page.click("instance-list instance-list-item .btn-install");
		// button should be "Installing"
		await page.waitForSelector("task-progress", { timeout: 1000 }); // make sure task-progress is visible
		await page.waitForSelector("task-progress >> text=Successfully installed instance 1.8.9 Test", { timeout: 0 }); // disable timeout
		// button should be "Play"
		await page.textContent("instance-list instance-list-item .btn-play-install").should.eventually.equal("Play");

		await page.waitForSelector("task-progress", { timeout: 6000, state: "hidden" }); // task-progress should hide after 5s. Timeout deliberately set to 6s.
	});

	it("should not launch instance without auth and should show login modal", async () => {
		await page.hover("instance-list instance-list-item");
		await page.click("instance-list instance-list-item .btn-play"); // click on play button

		await page.waitForSelector("#modal-login.ui.modal.visible"); // should show login modal
	});
});
