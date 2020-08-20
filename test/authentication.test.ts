import chai, { should } from "chai";
import chaiAsPromised from "chai-as-promised";
import { beforeSetup, afterSetup } from "./setup";
import type { ElectronPage, ElectronApplication } from "playwright-electron";
import { app } from "electron";

should();
chai.use(chaiAsPromised);

describe("Authentication", function () {
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

	it("should show the account modal", async () => {
		await page.click("#account-modal-link");
		await page.waitForSelector("#modal-account.ui.modal.visible");
	});

	it("should show the login modal", async () => {
		await page.click("#modal-account >> .content .ui.button");
		await page.waitForSelector("#modal-login.ui.modal.visible");
	});

	it("should display error if no input", async () => {
		await page.click("#login-btn");
		const errorString: string = await (await page.waitForSelector("#login-errors-container")).textContent();
		errorString.trim().should.equal("Please fill out the form!");
	});

	it("should not submit if no password", async () => {
		await page.fill("#username-field", "test@test.com");
		await page.click("#login-btn");
		const errorString: string = await (await page.waitForSelector("#login-errors-container")).textContent();
		errorString.trim().should.equal("Please fill out the form!");
	});

	it("should display invalid email / password error on invalid credentials", async () => {
		await page.fill("#username-field", "test@test.com");
		await page.fill("#password-field", "test");
		await page.click("#login-btn");
		await page.waitForSelector("#login-errors-container >> text=Invalid username or password! Please try again.", { timeout: 2000 });
	});
});
