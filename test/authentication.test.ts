import chai, { should } from "chai";
import chaiAsPromised from "chai-as-promised";
import type { ElectronApplication, Page } from "playwright-electron";
import { afterSetup, beforeSetup } from "./setup";

should();
chai.use(chaiAsPromised);

describe("Authentication", function () {
	this.timeout(0);

	let page: Page;
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
		await page.route("https://authserver.mojang.com/authenticate", route => route.fulfill({
			status: 403,
			body: JSON.stringify({
				error: "ForbiddenOperationException",
				errorMessage: "Invalid credentials. Invalid username or password."
			})
		}));

		await page.click("#login-btn");
		await page.waitForSelector("#login-errors-container >> text=Invalid username or password! Please try again.", { timeout: 5000 });
		await page.unroute("https://authserver.mojang.com/authenticate");
	});

	it("should successfully login", async () => {
		await page.route("https://authserver.mojang.com/authenticate", route =>
			route.fulfill({
				status: 200,
				body: JSON.stringify({
					user: {
						properties: [{
							"name": "preferredLanguage", "value": "en-us"
						}],
						id: "6b6b6172aaa643628898e1667907f1e3",
						username: "correct@email.com"
					},
					accessToken: "9RbCbLS897fmBHnS1s6B.sgbgvi9e8ubJIk92gaGd2i3aL3ateyLfGgsfeJfh8SkadaHurL9H92yHhojgsbEyf0dW3vY8fSifsaWULhevDSg4bdj7h78gguudfbhbfb9auohLH7KKb8GbYDubaUfgjfshjfba7sfsalAh03uyses8khHYB4EUFqhf8b7HgU4uHoudeIvS9uDe2yD8e72aiJuAdfyafUbbdufss4svV3b3D6YfGdBg7o.4iGOshUjdhD1bUYsEo8ohuIfiadIud2hb9UFe7Y33HY",
					clientToken: "UY6O897D8wGd2327gisA2043a880o3Sf",
					availableProfiles: [{
						name: "BloodyTurtles",
						id: "6b6b6172aaa643628898e1667907f1e3"
					}],
					selectedProfile: {
						name: "BloodyTurtles",
						id: "6b6b6172aaa643628898e1667907f1e3"
					}
				})
			})
		);

		await page.fill("#username-field", "correct@email.com");
		await page.fill("#password-field", "CorrectPassword");
		await page.click("#login-btn");

		await page.waitForSelector("#modal-login.ui.modal.hidden", { timeout: 3000, state: "hidden" });
		await page.unroute("https://authserver.mojang.com/authenticate");
	});

	it("should update login status in account modal", async () => {
		await page.click("#account-modal-link");
		await page.waitForSelector("#modal-account.ui.modal.visible");

		await page.textContent("modal-account .content .item .header").should.eventually.equal("BloodyTurtles");
	});

	it("should sign out of account", async () => {
		await page.route("https://authserver.mojang.com/invalidate", route => route.fulfill({
			status: 204 // no content
		}));
		await page.click("modal-account .content .item .right.red.button");
		await page.waitForSelector("modal-account .content .item .ui.primary.button");
		await page.unroute("https://authserver.mojang.com/invalidate");
	});
});
