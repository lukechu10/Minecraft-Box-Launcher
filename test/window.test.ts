import chai, { should } from "chai";
import chaiAsPromised from "chai-as-promised";
import { beforeSetup, afterSetup } from "./setup";
import type { ElectronPage, ElectronApplication } from "playwright-electron";

should();
chai.use(chaiAsPromised);

describe("Window", function () {
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
