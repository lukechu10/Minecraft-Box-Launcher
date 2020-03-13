"use-strict";
const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

const app = new Application({
	path: electronPath,
	args: [
		path.join(__dirname, "..", "dist/js/main", "main.js"),
		process.env.GITPOD_HOST === "https://gitpod.io" ? "--no-sandbox" : "" // run without sandboxing if using gitpod
	]
});

describe('Application launch', function () {
	this.timeout(10000);

	beforeEach(() => {
		return app.start();
	});

	afterEach(() => {
		if (app && app.isRunning()) {
			return app.stop();
		}
	});

	it("shows an initial window", () => {
		return app.client.getWindowCount().then((count) => {
			assert.strictEqual(count, 1);
			// Please note that getWindowCount() will return 2 if `dev tools` are opened.
			// assert.equal(count, 2)
		});
	});

	it("has the correct title", async () => {
		const title = await app.client.waitUntilWindowLoaded().browserWindow.getTitle();
		return assert.strictEqual(title, "Minecraft Box");
	});

	it("does not have the developer tools open", async () => {
		const devToolsAreOpen = await app.client.waitUntilWindowLoaded().browserWindow.isDevToolsOpened();
		return assert.strictEqual(devToolsAreOpen, false);
	});

	it("shows the instance page", async () => {
		await app.client.waitUntilWindowLoaded();
		const text = await app.client.getText("#content div h1");
		return assert.strictEqual(text, "Instances");
	});

	it("has no instances in the instance list", async () => {
		await app.client.waitUntilWindowLoaded();
		const list = await app.client.$$("div[is='instance-list] .instance-item");
		return assert.strictEqual(list.length, 0);
	});
});