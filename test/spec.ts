"use-strict";
import { Application } from "spectron";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import fs from "fs-extra";
import { expect } from "chai";

const app = new Application({
	path: require("electron") as unknown as string,
	args: [
		path.join(__dirname, "..", "dist/js/main", "main.js"),
		process.env.GITPOD_HOST === "https://gitpod.io" ? "--no-sandbox" : "" // run without sandboxing if using gitpod
	],
	chromeDriverArgs: ["remote-debugging-port=9222"]
});

describe("Application window", function () {
	this.timeout(30000);

	beforeEach(() => {
		return app.start();
	});

	afterEach(async () => {
		// get coverage report from window.__coverage__
		await app.client.waitUntilWindowLoaded();
		const coverageReport = (await app.client.execute(() => (window as any).__coverage__)).value;
		if (coverageReport && !_.isEmpty(coverageReport)) {
			const NYC_OUTPUT_BASE = path.resolve(".nyc_output");
			await fs.mkdirp(NYC_OUTPUT_BASE);
			const NYC_OUTPUT_DEST = path.resolve(NYC_OUTPUT_BASE, `${uuidv4()}.json`);
			fs.writeFileSync(NYC_OUTPUT_DEST, JSON.stringify(coverageReport), {
				encoding: "utf8"
			});
		}

		if (app && app.isRunning()) {
			return app.stop();
		}
	});

	it("shows an initial window", async () => {
		const n = await app.client.getWindowCount();
		expect(n).to.be.a("number");
		expect(n).to.equal(1);
	});

	it("has the correct title", async () => {
		await app.client.waitUntilWindowLoaded();
		const title = await app.browserWindow.getTitle();
		expect(title).to.be.a("string");
		expect(title).to.equal("Minecraft Box");
	});

	it("shows the instance page", async () => {
		await app.client.waitUntilWindowLoaded();
		const text = await app.client.getText("#content div h1");
		expect(text).to.be.a("string");
		expect(text).to.equal("Instances");
	});

	it("has no instances in the instance list", async () => {
		await app.client.waitUntilWindowLoaded();
		const list = await app.client.$$("div[is='instance-list'] .instance-item");
		expect(list).to.have.lengthOf(0);
	});

	it("shows the settings modal", async () => {
		await app.client.waitUntilWindowLoaded();
		await app.client.$("#content").$("div.ui.right.button").click();
		const res = await app.client.waitForVisible("#modal-settings:not(.animating)", 2000);
		expect(res).to.equal(true);
	});

	it("shows the login modal", async () => {
		await app.client.waitUntilWindowLoaded();
		await app.client.$("#login-status-text").click();
		const res = await app.client.waitForVisible("#modal-login:not(.animating)");
		expect(res).to.equal(true);
	});

	describe("Instance management", () => {
		async function fillOutInstanceForm() {
			await app.client.waitUntilWindowLoaded();
			await app.client.$("#content").$("div.ui.primary.button").click();
			const res = await app.client.waitForVisible("#modal-newInstance:not(.animating)", 2000);
			expect(res).to.be.equal(true); // make sure modal appears
			await app.client.$("#submit-newInstanceForm").click(); // attempt to create empty instance
			const isError = await app.client.$("#modal-newInstance").waitForExist(".ui.form.error", 2000);
			expect(isError).to.equal(true);

			// fill out form
			const form = app.client.$("#form-newInstance");
			await form.$("input[name='instance-name']").setValue("Test instance");
			// select instance type
			await form.$("#dropdown-type").click();
			await form.$("#dropdown-type").waitForVisible(".menu:not(.animating)", 2000);
			await form.$("#dropdown-type .menu .item").click(); // select first option (vanilla release)
			await form.$("#dropdown-type").waitForVisible(".menu:not(.animating)", 2000, true);
			// select instance version
			await form.waitForExist("#dropdown-id:not(.disabled)");
			await form.$("#dropdown-id").click();
			await form.$("#dropdown-id").waitForVisible(".menu:not(.animating)", 2000);
			await form.$("#dropdown-id .menu .item").click(); // select first option (latest vanilla release)
			await form.$("#dropdown-id").waitForVisible(".menu:not(.animating)", 2000, true);

			// click on create instance button
			await form.$("#submit-newInstanceForm").click();

			// wait for modal to close
			await app.client.$("#modal-newInstance").waitForVisible(2000, true);
			// check if new item has been added to instance list
			const instanceList = app.client.$("div[is='instance-list']");
			const items = await instanceList.$$(".instance-item");
			expect(items).to.have.lengthOf(1); // 1 instance
			expect(await instanceList.$(".instance-item").$(".content .text-instanceName").getText()).to.be.equal("Test instance"); // check instance title (set in form)
		}

		async function openInstanceInfoModal() {
			await fillOutInstanceForm();
			await app.client.$("div[is='instance-list'").$(".instance-item .ui.grid .thirteen.wide.column").click();
			await app.client.waitForVisible("#modal-info:not(.animating)", 2000);
		}
		it("can create new instances from the instance modal", async () => {
			await fillOutInstanceForm();
		});

		it("can show the instance info modal", async () => {
			await openInstanceInfoModal();
		});

		it("can show the instance rename modal", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-rename").click();
			await app.client.waitForVisible("#modal-rename:not(.animating)", 2000);
		});

		it("can show the instance options modal", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-options").click();
			await app.client.waitForVisible("#modal-options:not(.animating)", 2000);
		});

		it("can show the instance saves modal", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-saves").click();
			await app.client.waitForVisible("#modal-saves:not(.animating)", 2000);
		});

		it("can show the instance confirm delete modal", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-delete").click();
			await app.client.waitForVisible("#modal-confirmDelete:not(.animating)", 2000);
		});

		it("can delete an instance via instance confirm delete modal", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-delete").click();
			await app.client.waitForVisible("#modal-confirmDelete:not(.animating)", 2000);
			await app.client.$("#modal-confirmDelete").$(".ui.button.red").click();
			await app.client.waitForVisible("#modal-confirmDelete:not(.animating)", 2000, true);
			// make sure there are no more instances in instance list
			const list = await app.client.$$("div[is='instance-list'] .instance-item");
			expect(list).to.have.lengthOf(0);
		});

		it("can delete an instance via instance confirm delete modal without deleting folder", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-delete").click();
			await app.client.waitForVisible("#modal-confirmDelete:not(.animating)", 2000);
			await app.client.$("#modal-confirmDelete").$(".ui.button.red").click();
			await app.client.$("#modal-confirmDelete").$("input[name='deleteFolder']").click();
			await app.client.waitForVisible("#modal-confirmDelete:not(.animating)", 2000, true);
			// make sure there are no more instances in instance list
			const list = await app.client.$$("div[is='instance-list'] .instance-item");
			expect(list).to.have.lengthOf(0);
		});

		it("can rename an instance with the rename modal", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-rename").click();
			await app.client.waitForVisible("#modal-rename:not(.animating)", 2000);
			await app.client.$("#input-rename").setValue("Test instance 2"); // rename modal
			await app.client.$("#modal-rename").$(".ui.approve.button").click();
			await app.client.waitForVisible("#modal-rename:not(.animating)", 2000, true);
			// check that instance name in instance list changed
			const instanceList = app.client.$("div[is='instance-list']");
			expect(await instanceList.$(".instance-item").$(".content .text-instanceName").getText()).to.be.equal("Test instance 2");
		});

		it("can rename an instance with the options modal", async () => {
			await openInstanceInfoModal();
			await app.client.$(".btn-options").click();
			await app.client.waitForVisible("#modal-options:not(.animating)", 2000);
			await app.client.$("#modal-options").$("input[name='instance-name']").setValue("Test instance 2"); // options modal
			await app.client.$("#modal-options").waitForExist("#btn-modalOptionsSave:not(.disabled)", 500); // wait for save button to become clickable
			await app.client.$("div#btn-modalOptionsSave").click();
			await app.client.waitForVisible("#modal-options:not(.animating)", 2000, true);
			// check that instance name in instance list changed
			const instanceList = app.client.$("div[is='instance-list']");
			expect(await instanceList.$(".instance-item").$(".content .text-instanceName").getText()).to.be.equal("Test instance 2");
		});
	});
});
