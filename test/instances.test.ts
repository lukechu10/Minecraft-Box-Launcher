import chai, { should } from "chai";
import chaiAsPromised from "chai-as-promised";
import { beforeSetup, afterSetup } from "./setup";
import type { ElectronPage, ElectronApplication } from "playwright-electron";
import { app } from "electron";

should();
chai.use(chaiAsPromised);

describe("Instances", function () {
	this.timeout(10000);

	let page: ElectronPage;
	let electronApp: ElectronApplication;

	before(async () => {
		this.timeout(5000);
		const setup = (await beforeSetup());
		page = setup.page;
		electronApp = setup.electronApp;
	});
	after(async () => {
		return afterSetup(electronApp);
	});

	it("initially has no instances in instance list", async () => {
		await page.$$("#instance-list-container > instance-list > .ui.list.container > instance-list-item").should.eventually.have.lengthOf(0);
	});

	it("can show the new instance modal", async () => {
		await page.click("#content >> div.ui.primary.button");
		await page.waitForSelector("#modal-newInstance.ui.modal.visible", { timeout: 2000 });
	});

	it("can not submit empty new instance form", async () => {
		// try to submit when empty
		await page.click("#submit-newInstanceForm");
		await page.waitForSelector("#modal-newInstance >> .ui.form.error", { timeout: 2000 });
	});

	it("can add new 1.8.9 instance via new instance modal", async () => {
		(await page.$$("#modal-newInstance.ui.modal.visible")).should.have.lengthOf(1);

		// fill out instance form
		const form = await page.$("#form-newInstance");
		// instance name
		await (await form.$("input[name='instance-name']")).fill("1.8.9 Instance");
		// instance type
		await (await form.$("#dropdown-type")).click();
		await page.waitForSelector("#form-newInstance >> #dropdown-type >> .menu:not(.animating)", { timeout: 2000 });
		await (await form.$("#dropdown-type .menu .item[data-value='vanilla-release']")).click(); // select vanilla release option
		// instance version

		// make sure latest version meta was fetched
		await page.waitForTimeout(6000); // TODO: remove timeout
		await (await form.$("#dropdown-id")).click();
		await page.waitForSelector("#form-newInstance >> #dropdown-id >> .menu:not(.animating)", { timeout: 2000 });
		await page.click("#dropdown-id .menu .item[data-value='1.8.9']", { timeout: 5000 }); // select vanilla release option

		// click on create instance button
		await page.click("#submit-newInstanceForm");

		// make sure there are no errors
		await page.$$("#modal-newInstance >> .ui.form.error").should.eventually.have.lengthOf(0, "Error when creating new instance");

		// check if instance closes when form is submitted
		await page.waitForSelector("#modal-newInstance.ui.modal.hidden", { timeout: 2000, state: "hidden" });
	});

	it("automatically updates instance list after new instance creation", async () => {
		await page.$$("instance-list >> instance-list-item").should.eventually.have.lengthOf(1);
	});
});
