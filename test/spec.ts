"use-strict";
import { Application } from "spectron";
import assert from "assert";
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

describe("Application launch", function () {
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
		return assert.strictEqual(n, 1);
	});

	it("has the correct title", async () => {
		await app.client.waitUntilWindowLoaded();
		const title = await app.browserWindow.getTitle();
		return assert.strictEqual(title, "Minecraft Box");
	});

	it("shows the instance page", async () => {
		await app.client.waitUntilWindowLoaded();
		const text = await app.client.getText("#content div h1");
		return assert.strictEqual(text, "Instances");
	});

	it("has no instances in the instance list", async () => {
		await app.client.waitUntilWindowLoaded();
		const list = await app.client.$$("div[is='instance-list'] .instance-item");
		return assert.strictEqual(list.length, 0);
	});

	it("shows the settings modal", async () => {
		await app.client.waitUntilWindowLoaded();
		await app.client.$("#content").$("div.ui.right.button").click();
		const res = await app.client.waitForVisible("#modal-settings:not(.animating)", 2000);
		return res;
	});

	it("shows the login modal", async () => {
		await app.client.waitUntilWindowLoaded();
		await app.client.$("#login-status-text").click();
		const res = await app.client.waitForVisible("#modal-login:not(.animating)");
		return res;
	});

	describe.only("Instance management", () => {
		it("can create new instances from the instance modal", async () => {
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
		});
	});
});
