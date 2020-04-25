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

async function fillOutInstanceForm(name: string = "Test instance", type: string = "release") {
	await app.client.waitUntilWindowLoaded();
	await app.client.$("#content").$("div.ui.primary.button").click();
	const res = await app.client.waitForVisible("#modal-newInstance:not(.animating)", 2000);
	expect(res).to.be.equal(true); // make sure modal appears
	await app.client.$("#submit-newInstanceForm").click(); // attempt to create empty instance
	const isError = await app.client.$("#modal-newInstance").waitForExist(".ui.form.error", 2000);
	expect(isError).to.equal(true);

	// fill out form
	const form = app.client.$("#form-newInstance");
	await form.$("input[name='instance-name']").setValue(name);
	// select instance type
	await form.$("#dropdown-type").click();
	await form.$("#dropdown-type").waitForVisible(".menu:not(.animating)", 2000);
	if (type === "release")
		await form.$("#dropdown-type .menu .item[data-value='vanilla-release']").click(); // select first option (vanilla release)
	else if (type === "snapshot")
		await form.$("#dropdown-type .menu .item[data-value='vanilla-snapshot']").click(); // select second (vanilla snapshot)
	else if (type === "historical")
		await form.$("#dropdown-type .menu .item[data-value='vanilla-historical']").click(); // select third (vanilla historical)

	await form.$("#dropdown-type").waitForVisible(".menu:not(.animating)", 2000, true);
	// select instance version
	await form.waitForExist("#dropdown-id:not(.disabled)");
	await form.$("#dropdown-id").click();
	await form.$("#dropdown-id").waitForVisible(".menu:not(.animating)", 2000);
	await form.$("#dropdown-id .menu .item").click(); // select first option (latest vanilla release)
	await form.$("#dropdown-id").waitForVisible(".menu:not(.animating)", 2000, true);

	// click on create instance button
	await form.$("#submit-newInstanceForm").click();

	// check for no errors
	const errorForm = await app.client.$("#modal-newInstance").$$(".ui.form.error");
	expect(errorForm).to.have.lengthOf(0, "Error creating new instance");

	// wait for modal to close
	await app.client.$("#modal-newInstance").waitForVisible(2000, true);
	// check if new item has been added to instance list
	const instanceList = app.client.$("instance-list");
	const items = await instanceList.$$(".instance-item");
	expect(items).to.have.lengthOf(1); // 1 instance
	expect(await instanceList.$(".instance-item").$(".content .text-instanceName").getText()).to.equal(name); // check instance title (set in form)
}

async function openInstanceInfoModal() {
	await fillOutInstanceForm();
	await app.client.$("instance-list").$(".instance-item .ui.grid .thirteen.wide.column").click();
	await app.client.waitForVisible("#modal-info:not(.animating)", 2000);
}

describe("Application window", function () {
	this.timeout(1000000);

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
			await fs.writeJSON(NYC_OUTPUT_DEST, coverageReport, {
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
		const list = await app.client.$$("instance-list .instance-item");
		expect(list).to.have.lengthOf(0);
	});

	it("shows the settings modal", async () => {
		await app.client.waitUntilWindowLoaded();
		await app.client.$("#content").$("div.ui.right.button").click();
		const res = await app.client.waitForVisible("#modal-settings:not(.animating)", 2000);
		expect(res).to.equal(true);
	});

	describe("Authentication", () => {
		describe("Authentication modal", () => {
			it("shows the account modal", async () => {
				await app.client.waitUntilWindowLoaded();
				await app.client.$("#account-modal-link").click();
				const res = await app.client.waitForVisible("#modal-account:not(.animating)");
				expect(res).to.equal(true);
			});

			it("can show the login modal", async () => {
				await app.client.waitUntilWindowLoaded();
				await app.client.$("#account-modal-link").click();
				await app.client.waitForVisible("#modal-account:not(.animating)");
				await app.client.$("#modal-account").click(".content .ui.button");
				await app.client.waitForVisible("#modal-login:not(.animating)");
			});

			it("should display error if no input", async () => {
				await app.client.waitUntilWindowLoaded();
				await app.client.$("#account-modal-link").click();
				await app.client.waitForVisible("#modal-account:not(.animating)");
				await app.client.$("#modal-account").click(".content .ui.button");
				await app.client.waitForVisible("#modal-login:not(.animating)");
				await app.client.$("#login-btn").click(); // click on submit button
				await app.client.waitForText("#login-errors-container", 1000);
				expect(await app.client.$("#login-errors-container").getText()).to.equal("Please fill out the form!");
			});

			it.skip("should not submit if invalid email", async () => {
				await app.client.waitUntilWindowLoaded();
				await app.client.$("#account-modal-link").click();
				await app.client.waitForVisible("#modal-account:not(.animating)");
				await app.client.$("#modal-account").click(".content .ui.button");
				await app.client.waitForVisible("#modal-login:not(.animating)");
				await app.client.$("#username-field").setValue("test@test.com"); // fill out username field
				await app.client.$("#login-btn").click(); // click on submit button
				await app.client.waitForText("#login-errors-container", 1000);
				expect(await app.client.$("#login-errors-container").getText()).to.equal("Please fill out the form!");
			});

			it("should display invalid email / password error", async () => {
				await app.client.waitUntilWindowLoaded();
				await app.client.$("#account-modal-link").click();
				await app.client.waitForVisible("#modal-account:not(.animating)");
				await app.client.$("#modal-account").click(".content .ui.button");
				await app.client.waitForVisible("#modal-login:not(.animating)");
				// fill out form
				await app.client.$("#username-field").setValue("test@test.com");
				await app.client.$("#password-field").setValue("test");
				await app.client.$("#login-btn").click(); // click on submit button
				// wait for error message to appear
				await app.client.waitForText("#login-errors-container", 2000);
				expect(await app.client.$("#login-errors-container").getText()).to.equal("Invalid username or password! Please try again.");
			});
		});
	});

	describe("Instance management", () => {
		it("can create new instances from the instance modal", async () => {
			await fillOutInstanceForm();
		});

		it("can not create two instances with same name", async () => {
			await fillOutInstanceForm("Test 1");
			// fill out second form
			await app.client.$("#content").$("div.ui.primary.button").click();
			await app.client.waitForVisible("#modal-newInstance:not(.animating)", 2000);
			// fill out form
			const form = app.client.$("#form-newInstance");
			await form.$("input[name='instance-name']").setValue("Test 1");
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
			// check for no errors
			const errorForm = await app.client.$("#modal-newInstance").$$(".ui.form.error");
			expect(errorForm).to.have.lengthOf(1, "Can create multiple instances with same name");
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

		describe("Saves modal", async () => {
			it("can show the instance saves modal", async () => {
				await openInstanceInfoModal();
				await app.client.$(".btn-saves").click();
				await app.client.waitForVisible("#modal-saves:not(.animating)", 2000);
			});

			it("can show the servers tab", async () => {
				await openInstanceInfoModal();
				await app.client.$(".btn-saves").click();
				await app.client.waitForVisible("#modal-saves:not(.animating)", 2000);
				await app.client.$("#modal-saves").$(".menu .item[data-tab='servers']").click();
				await app.client.$("#modal-saves").waitForVisible(".tab.segment[data-tab='servers']", 500);
			});

			it("should not have any servers in server list", async () => {
				await openInstanceInfoModal();
				await app.client.$(".btn-saves").click();
				await app.client.waitForVisible("#modal-saves:not(.animating)", 2000);
				await app.client.$("#modal-saves").$(".menu .item[data-tab='servers']").click();
				await app.client.$("#modal-saves").waitForVisible(".tab.segment[data-tab='servers']", 500);
				expect(await app.client.$("#modal-saves").$(".tab.segment[data-tab='servers']").$("tbody").$$("tr")).to.have.lengthOf(0);
				expect(await app.client.$("#modal-saves").$(".tab.segment[data-tab='servers']").$(".ui.error.message").getText()).to.equal("You have not created any servers yet! Start playing to see your saved servers."); // should show error message
			});

			it("should show saved servers", async () => {
				await openInstanceInfoModal();
				// add mock servers.dat to instance folder
				const userDataPath = (await app.client.execute(() => window.require("electron").remote.app.getPath("userData"))).value;
				const instanceDir = path.join(userDataPath, "instances", "Test instance");
				await fs.mkdirp(instanceDir);
				await fs.copyFile(path.resolve("./test/mock/servers.dat"), path.join(instanceDir, "servers.dat"));

				await app.client.$(".btn-saves").click();
				await app.client.waitForVisible("#modal-saves:not(.animating)", 2000);
				await app.client.$("#modal-saves").$(".menu .item[data-tab='servers']").click();
				await app.client.$("#modal-saves").waitForVisible(".tab.segment[data-tab='servers']", 500);
				expect(await app.client.$("#modal-saves").$(".tab.segment[data-tab='servers']").$("tbody").$$("tr")).to.have.lengthOf(1);
				const tableBody = app.client.$("#modal-saves").$(".tab.segment[data-tab='servers']").$("tbody");
				const tableCols = tableBody.$("tr").$$("td");
				expect(await tableCols).to.have.lengthOf(3);
				// @ts-ignore
				expect((await (tableCols).getText() as string).startsWith("Hypixel mc.hypixel.net")).to.true; // table row
				// @ts-ignore
				await app.client.waitUntil(async () => !(new String(await (tableCols).getText()).endsWith("Pinging...")), 6000);
			});
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
			const list = await app.client.$$("instance-list .instance-item");
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
			const list = await app.client.$$("instance-list .instance-item");
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
			const instanceList = app.client.$("instance-list");
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
			const instanceList = app.client.$("instance-list");
			expect(await instanceList.$(".instance-item").$(".content .text-instanceName").getText()).to.be.equal("Test instance 2");
		});

		describe("Install and Launch", () => {
			it("can install latest release", async () => {
				await fillOutInstanceForm();
				await app.client.execute(() => {
					(window as any).$(".instance-item")[0].install();
				});
				expect(await app.client.waitForExist("task-progress.visible", 2000)).to.be.true;
				// wait for play button
				await app.client.waitForExist(".btn-play", 1000000);
				expect(await app.client.$("task-progress").$(".label").getText()).to.equal("Successfully installed instance Test instance"); // make sure task progress shows current message
				await app.client.waitForExist("task-progress.hidden", 10000);
			});

			it("can install latest snapshot", async () => {
				await fillOutInstanceForm("Test instance", "snapshot");
				await app.client.execute(() => {
					(window as any).$(".instance-item")[0].install();
				});
				// wait for play button
				await app.client.waitForExist(".btn-play", 1000000);
			});

			it("can install historical versions", async () => {
				await fillOutInstanceForm("Test instance", "historical");
				await app.client.execute(() => {
					(window as any).$(".instance-item")[0].install();
				});
				// wait for play button
				await app.client.waitForExist(".btn-play", 1000000);
			});

			it("can detect missing version json", async () => {
				await fillOutInstanceForm();
				// set loggedIn status to true
				await app.client.execute(() => {
					(window as any).AuthStore.set("loggedIn", true);
				});
				// launch instance
				await app.client.execute(() => {
					(window as any).$("instance-list-item")[0].play();
				});

				// wait until corrupted version json modal appears
				await app.client.waitForVisible("#modal-corrupted:not(.animating)", 3000);
			});
		});
	});

	describe("Home Dashboard", () => {
		it("can show home dashboard page", async () => {
			await app.client.waitUntilWindowLoaded();
			await app.client.$("navbar").$("a.item[href='./home.html']").click();
			const text = await app.client.getText("#content div h1");
			expect(text).to.be.a("string");
			expect(text).to.equal("Home");
		});

		it("can show latest instance played", async () => {
			await fillOutInstanceForm("Test instance home");
			await app.client.$("navbar").$("a.item[href='./home.html']").click();
			await app.client.waitForExist("#last-played-instance");
			const instanceName = await app.client.getText("#last-played-instance").$("span").getText("strong");
			expect(instanceName).to.be.a("string");
			expect(instanceName).to.equal("Test instance home");
			const instanceLastPlayed = await app.client.getText("#last-played-instance").getText(".meta");
			expect(instanceLastPlayed).to.be.a("string");
			expect(instanceLastPlayed).to.equal("Last played: never");
		});

		it("can show instance info modal from instance last played view", async () => {
			await fillOutInstanceForm("Test instance home");
			await app.client.$("navbar").$("a.item[href='./home.html']").click();
			await app.client.waitForExist("#last-played-instance");
			await app.client.click("#last-played-instance");

			await app.client.waitForVisible("#modal-info:not(.animating)", 2000);
		});

		it("can show account modal from account widget", async () => {
			await app.client.waitUntilWindowLoaded();
			await app.client.$("navbar").$("a.item[href='./home.html']").click();
			await app.client.waitForExist("#account-modal-link-home");
			await app.client.click("#account-modal-link-home");

			const res = await app.client.waitForVisible("#modal-account:not(.animating)");
			expect(res).to.equal(true);
		});
	});
});
