import chai, { should } from "chai";
import chaiAsPromised from "chai-as-promised";
import { beforeSetup, afterSetup } from "./setup";
import type { ElectronPage, ElectronApplication } from "playwright-electron";

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
	});
});