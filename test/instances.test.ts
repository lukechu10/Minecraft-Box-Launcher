
import chai, { should } from "chai";
import chaiAsPromised from "chai-as-promised";
import fs from "fs-extra";
import path from "path";
import type { ElectronApplication, ElectronPage } from "playwright-electron";
import { afterSetup, beforeSetup } from "./setup";

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

		// inject mock versionsMetaCache.json
		const userDataPath: string = await (await electronApp.firstWindow()).evaluate(() => (window as any).require("electron").remote.app.getPath("userData"));
		await fs.copyFile(path.resolve("./test/mock/versionsMetaCache.json"), path.join(userDataPath, "versionsMetaCache.json"));
	});
	after(async () => {
		return afterSetup(electronApp);
	});

	async function createNewInstanceWithForm(name: string): Promise<void> {
		await page.waitForSelector("#modal-newInstance.ui.modal.visible");
		// instance name
		await page.fill("#form-newInstance input[name='instance-name']", name);
		// instance type
		await page.click("#dropdown-type");
		await page.waitForSelector("#form-newInstance >> #dropdown-type >> .menu:not(.animating)", { timeout: 2000 });
		await page.click("#dropdown-type .menu .item[data-value='vanilla-release']"); // select vanilla release option
		// instance version
	
		await page.click("#dropdown-id");
		await page.waitForSelector("#form-newInstance >> #dropdown-id >> .menu:not(.animating)", { timeout: 2000 });
		await page.click("#dropdown-id .menu .item[data-value='1.8.9']", { timeout: 5000 }); // select vanilla release option
	
		// click on create instance button
		await page.click("#submit-newInstanceForm");
	
		// make sure there are no errors
		await page.$$("#modal-newInstance >> .ui.form.error").should.eventually.have.lengthOf(0, "Error when creating new instance");
	
		// check if instance closes when form is submitted
		await page.waitForSelector("#modal-newInstance.ui.modal.hidden", { timeout: 2000, state: "hidden" });
	}

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

	it("can add new 1.8.9 instance via new instance modal with name '1.8.9 Test'", async () => {
		await createNewInstanceWithForm("1.8.9 Test")
	});

	it("automatically updates instance list after new instance creation", async () => {
		await page.$$("instance-list >> instance-list-item").should.eventually.have.lengthOf(1);
	});

	it("should show instance modal for '1.8.9 Test'", async () => {
		await page.click("instance-list >> instance-list-item");
		await page.waitForSelector("instance-modal-container.ui.modal.visible");
	});

	it("should have correct instance name in modal", async () => {
		await page.textContent("instance-modal-container .header").should.eventually.equal("1.8.9 Test");
	});

	it("should be on quick info page", async () => {
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Quick Info");
	});

	it("should sync name textbox with modal header", async () => {
		await page.fill("instance-modal-container .content quick-info-page vaadin-text-field[label='Instance Name'] input", "1.8.9 Test Rename");
		await page.textContent("instance-modal-container .header").should.eventually.equal("1.8.9 Test Rename");
	});

	it("should not be able to navigate to new tab with unsaved changes", async () => {
		await page.waitForSelector("unsaved-data-warning"); // warning should be visible
		await page.waitForTimeout(1000); // FIXME
		await page.click("instance-modal-container .content .ui.vertical.menu .item >> text=Saves");
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Quick Info"); // should still be on Quick Info page
	});

	it("should be able to save changes", async () => {
		await page.click("unsaved-data-warning #save-button");
		await page.waitForSelector("unsaved-data-warning", { state: "hidden" }); // warning should be hidden
		// TODO: check if name updated in instance-list
	});

	it("should be able to discard changes", async () => {
		await page.fill("instance-modal-container .content quick-info-page vaadin-text-field[label='Instance Name'] input", "1.8.9 Test Rename 2"); // change name
		await page.waitForSelector("unsaved-data-warning"); // warning should be visible
		await page.waitForTimeout(1000); // FIXME
		await page.click("unsaved-data-warning #discard-button");
		await page.waitForSelector("unsaved-data-warning", { state: "hidden" }); // warning should be hidden
		await page.textContent("instance-modal-container .header").should.eventually.equal("1.8.9 Test Rename");

		// reset name to '1.8.9 Test'
		await page.fill("instance-modal-container .content quick-info-page vaadin-text-field[label='Instance Name'] input", "1.8.9 Test");
		await page.click("unsaved-data-warning #save-button");
	});

	it("should navigate to saves page", async () => {
		await page.click("instance-modal-container .content .ui.vertical.menu .item >> text=Saves");
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Saves");
	});

	it("should navigate to servers page", async () => {
		await page.click("instance-modal-container .content .ui.vertical.menu .item >> text=Servers");
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Servers");
	});

	it("should display available servers with mock servers.dat", async () => {
		// copy servers.dat
		const userDataPath: string = await (await electronApp.firstWindow()).evaluate(() => (window as any).require("electron").remote.app.getPath("userData"));
		const instanceDir = path.join(userDataPath, "instances", "1.8.9 Test");
		await fs.mkdirp(instanceDir);
		await fs.copyFile(path.resolve("./test/mock/servers.dat"), path.join(instanceDir, "servers.dat"));

		// click on refresh button
		await page.click("instance-modal-container servers-page .ui.basic.button");
		await page.textContent("instance-modal-container servers-page table tbody tr").should.eventually.include("Hypixel").and.include("mc.hypixel.net");
	});

	it("should navigate to logs page", async () => {
		await page.click("instance-modal-container .content .ui.vertical.menu .item >> text=Logs");
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Logs");
	});

	it("should navigate to mods page", async () => {
		await page.click("instance-modal-container .content .ui.vertical.menu .item >> text=Mods");
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Mods");
	});

	it("should navigate to delete page", async () => {
		await page.click("instance-modal-container .content .ui.vertical.menu .item >> text=Delete");
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Delete");
	});

	it("should not delete instance without confirmation", async () => {
		await page.click("instance-modal-container .content #delete-button");
		await page.textContent("instance-modal-container .content #confirm-message").should.eventually.equal("You must enter the name of the instance in the text box.");
	});

	it("should navigate to advanced options page", async () => {
		await page.click("instance-modal-container .content .ui.vertical.menu .item >> text=Advanced Options");
		await page.textContent("instance-modal-container .content .ui.header").should.eventually.equal("Advanced Options");
	});

	it("should close instance modal", async () => {
		await page.evaluate(() => { $("instance-modal-container").modal("hide"); }); // TODO: change to interaction
		await page.waitForSelector("instance-modal-container.ui.modal.hidden", { state: "hidden" });
	});

	it("should not add another instance with same name '1.8.9 Test'", async () => {
		await page.click("#content >> div.ui.primary.button");
		await page.waitForSelector("#modal-newInstance.ui.modal.visible", { timeout: 2000 });
		// instance name
		await page.fill("#form-newInstance input[name='instance-name']", "1.8.9 Test");
		// instance type
		await page.click("#dropdown-type");
		await page.waitForSelector("#form-newInstance >> #dropdown-type >> .menu:not(.animating)", { timeout: 2000 });
		await page.click("#dropdown-type .menu .item[data-value='vanilla-release']"); // select vanilla release option
		// instance version
	
		await page.click("#dropdown-id");
		await page.waitForSelector("#form-newInstance >> #dropdown-id >> .menu:not(.animating)", { timeout: 2000 });
		await page.click("#dropdown-id .menu .item[data-value='1.8.9']", { timeout: 5000 }); // select vanilla release option
	
		// click on create instance button
		await page.click("#submit-newInstanceForm");
	
		// make sure there are no errors
		await page.$$("#modal-newInstance >> .ui.form.error").should.eventually.have.lengthOf(1, "Error when creating new instance");
	
		// check if instance closes when form is submitted
		await page.waitForSelector("#modal-newInstance.ui.modal.hidden", { timeout: 2000, state: "hidden" });
	});
});
